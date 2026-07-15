# Hexagonal Architecture CLI `tshex-cli`

`tshex-cli` creates the base structure of a library organized by contexts. The structure groups shared contracts, domain concepts, use cases, and adapters into directories with defined responsibilities.

In this guide, we will build a library named `core` with a context named `users`. The walkthrough starts with the CLI and then explains the purpose of the generated components.

The examples in this guide are intentionally simple. They are designed to show the responsibility of each component, not to cover real infrastructure or production scenarios.

## Why?

Hexagonal architecture is a software design pattern that separates the core domain of the application from the external dependencies. This separation is achieved by dividing the application into layers. Each layer has a specific responsibility and interacts with the other layers in a specific way.

The goal is to separate the domain code from installed dependencies. A Hexagonal Architecture framework would work against that goal, since it couples the domain code to the framework itself. That is why this CLI exists: it scaffolds the structure for you, generating a codebase you own and control, instead of a framework.

## Getting started

### Installation

Install the package in your Node.js project:

```bash
npm install tshex-cli
```

Or install it globally:

```bash
npm install -g tshex-cli
```

The package registers the `tshex` executable. You can invoke it with `npx` from the project directory.

### Help

View the available commands and options with:

```bash
npx tshex --help
```

### Create a library

The `--lib` option receives the name of the library's root directory:

```bash
npx tshex --lib core
```

In this example, `core` will contain the shared code, the contexts, and the library's main implementation.

### Create a context

The `--ctx` option receives the context name:

```bash
npx tshex --ctx users
```

A context groups the rules and operations of an application capability. `users`, `sales`, `billing`, and `inventory` are examples of contexts.

### Create the library and the first context

You can generate both components in a single execution:

```bash
npx tshex --lib core --ctx users
```

The command creates this structure:

```text
core/
├── index.d.ts
├── main.ts
├── shared/
│   ├── application/
│   │   ├── data/
│   │   │   ├── drivers.ts
│   │   │   ├── managers.ts
│   │   │   └── repositories.ts
│   │   ├── events.ts
│   │   ├── http.ts
│   │   ├── loggers.ts
│   │   ├── services.ts
│   │   └── validations.ts
│   └── domain/
│       ├── aggregates.ts
│       ├── entities.ts
│       ├── errors.ts
│       └── value-objects.ts
└── users/
    ├── adapters/
    ├── application/
    ├── domain/
    └── example-ports.ts
```

### Choose the destination directory

The `--dir` option specifies the directory from which the structure is created:

```bash
npx tshex --dir ./src --lib core --ctx users
```

The example library is created at `src/core`.

To add a context to an existing library, use the library as the destination directory:

```bash
npx tshex --dir ./core --ctx billing
```

The context is created at `core/billing`.

### Create a context for React

The `--react` option creates a context with directories intended for a React application:

```bash
npx tshex --ctx users --react
```

You can also use its short form:

```bash
npx tshex --ctx users -R
```

The context structure includes adapters for APIs, hooks, and schemas, together with application, domain, and language resources:

```text
users/
├── adapters/
│   ├── api/
│   ├── hooks/
│   └── schemas/
├── application/
├── domain/
└── languages/
```

## Library structure

The library is divided into a root, a shared directory, and one or more contexts. Each level has a role in the implementation.

### Root

The root contains `index.d.ts` and `main.ts`.

`index.d.ts` declares the types available to the library. `main.ts` contains the main implementation and the public components that belong directly to that entry point.

### Shared code

The `shared` directory contains code used by multiple contexts. It holds abstractions, interfaces, contracts, base types, and specific implementations with a common meaning across the library.

```text
shared/
├── domain/
└── application/
```

`shared/domain` contains foundations for modeling business concepts. `shared/application` contains contracts for coordinating use cases, data sources, events, validations, HTTP responses, and logs.

### Contexts

A context represents an application capability and groups its vocabulary, rules, and operations.

```text
users/
billing/
sales/
inventory/
```

Separating by context organizes an application around its capabilities. Multiple contexts can be part of the same project, process, and data source. Each context preserves its own rules while sharing the general abstractions in `shared`.

Each generated context contains three directories:

```text
domain/
application/
adapters/
```

#### `domain`

Contains the context's capabilities. A capability groups business knowledge that can be used in different processes: validating an email address, identifying an entity, calculating a price, changing an order's status, or grouping the parts of a sale.

Value objects, entities, and aggregates materialize these capabilities through data, rules, and behavior.

#### `application`

Contains the application of domain capabilities in processes that fulfill system purposes.

An application service combines capabilities to complete an operation. For example, the process of registering a user can validate the email address, construct the entity, save its data, publish an event, and log the result.

#### Context root

The generated context root contains `example-ports.ts` as a starting point for the context's ports. You can keep that file, replace it, or add `index.ts` and other `.ts` files at the context root as the communication surface grows.

A port describes a form of communication between the context and another system. It defines the received data, the returned data, and the operation available at that boundary.

#### `adapters`

Contains the integrations that connect the context with other systems. An adapter imports a port, implements the communication defined by that port, and connects an external input or output to an application process.

An adapter can integrate an HTTP controller, a message consumer, an SDK, a driver, a remote client, an event bus, or a logging provider.

### Layered architecture

The structure is organized into three levels: capabilities, processes, and communication.

```text
External system
      ↕
Port + adapter
      ↓
  Application
      ↓
    Domain
```

The domain occupies the inner layer and contains the context's capabilities.

The application occupies the middle layer and uses those capabilities to build processes that fulfill system purposes.

Ports and adapters occupy the outer layer and handle communication between systems.

A port declares the communication available at the context boundary: what data enters, what data leaves, and which operation is exposed. Ports are declared in `.ts` modules located at the context root. Many projects centralize them in `index.ts`, but the generated template starts with `example-ports.ts`.

An adapter implements that communication. It imports the corresponding port, translates external input or output into the application process format, and delegates the work to the application service.

The import direction follows this path:

```text
adapter → port
adapter → application
application → domain
```

One possible arrangement is to declare a port such as `CreateUserPort` in `users/index.ts`. An adapter can import that port and connect an external request to a service such as `create-user-service.ts`. In this guide, that service uses `UserName`, `Email`, and `User` to complete the registration.

> **Tip:** start the implementation inside the context and move a component to `shared` when its meaning and use belong to multiple contexts.

## Library types

### `index.d.ts`

The file declares the generic type:

```ts
type Generic<T = unknown> = Record<string, T>
```

`Generic<T>` represents an object with `string` keys and values of a common type.

```ts
const filters: Generic<string> = {
    status: 'active'
}
```

When the type is omitted, the values use `unknown`:

```ts
const metadata: Generic = {
    retries: 2
}
```

Data source contracts use this form to represent plain objects whose specific structure will be defined by each implementation.

## Shared domain

The domain starts with small concepts and progresses toward structures that combine multiple identities. We will begin with value objects, continue with entities, and finish with aggregates.

### Value objects

A value object represents a concept with its own rules, semantics, or behavior. Its identity is determined by its value.

The `shared/domain/value-objects.ts` file generates the `ValueObject<T>` base class and the `Email` and `NullableBoolean` implementations.

#### Create an email address

`Email` turns text into a domain concept with validation and its own operations:

```ts
import { Email } from './core/shared/domain/value-objects.js'

const email = Email.from('ana@example.com')

email.value
email.username
email.domain
```

Creation is performed with `Email.from()`. This method runs `Email.isValid()` before constructing the instance.

```ts
Email.isValid('ana@example.com')
```

Every creation follows the same validity rule:

```text
received value
    ↓
isValid(value)
    ↓
from(value)
    ↓
valid instance
```

When validation fails, `from()` throws `ValueError`.

> **Tip:** use a native type when it fully expresses the data. Create a value object when the concept provides its own rules or operations. A text identifier can be represented with `string`; an email address benefits from `Email` because it includes validation and behavior.

#### Represent a nullable Boolean state

`NullableBoolean` models the values `true`, `false`, and `null`:

```ts
import { NullableBoolean } from './core/shared/domain/value-objects.js'

const active = NullableBoolean.from(null)

active.value
active.isIndeterminate()
```

The `isIndeterminate()` method expresses an operation specific to the concept and allows the `null` state to be checked with explicit intent.

#### Implement a value object

We will create a user name. The example has one rule and one small operation so the focus stays on the value object itself.

```ts
import { ValueError } from '../../shared/domain/errors.js'
import { ValueObject } from '../../shared/domain/value-objects.js'

export class UserName extends ValueObject<string> {
    public override readonly value: string

    protected constructor(value: string) {
        super()
        this.value = value
    }

    public override equals(
        other: UserName | null | undefined
    ): boolean {
        return other instanceof UserName &&
            this.value === other.value
    }

    public normalized(): string {
        return this.value.trim().toLowerCase()
    }

    public static override isValid(value: unknown): boolean {
        return typeof value === 'string' &&
            value.trim().length > 0
    }

    public static from(value: string): UserName {
        if (this.isValid(value) === false) {
            throw new ValueError(value, this.name)
        }

        return new this(value)
    }
}
```

Now we can create and use the concept:

```ts
const name = UserName.from('Ana')
const normalized = name.normalized()
```

`isValid()` centralizes the rule. `from()` creates the valid instance. `normalized()` adds behavior specific to the concept.

### Entities

An entity represents a concept with its own identity. Two instances represent the same element when they share that identity.

The `shared/domain/entities.ts` file generates the `Entity` base class. Each entity implements `equals()` and `toJSON()`.

This example creates an entity for the `users` context.

```ts
import { Entity } from '../../shared/domain/entities.js'
import {
    Email,
    NullableBoolean
} from '../../shared/domain/value-objects.js'

type UserName = {
    value: string
}

export class User extends Entity {
    public constructor(
        public readonly id: string,
        public readonly name: UserName,
        public readonly email: Email,
        public readonly active: NullableBoolean
    ) {
        super()
    }

    public override equals(other: Entity): boolean {
        return other instanceof User && other.id === this.id
    }

    public override toJSON(): Record<string, unknown> {
        return {
            id: this.id,
            name: this.name.value,
            email: this.email.value,
            active: this.active.value
        }
    }
}
```

The `id` property defines the identity. The `equals()` method compares entities using that property.

`toJSON()` produces a plain representation of the entity:

```ts
import {
    Email,
    NullableBoolean
} from '../../shared/domain/value-objects.js'

type UserName = {
    value: string
}

class User {
    public constructor(
        public readonly id: string,
        public readonly name: UserName,
        public readonly email: Email,
        public readonly active: NullableBoolean
    ) {}

    public toJSON(): Record<string, unknown> {
        return {
            id: this.id,
            name: this.name.value,
            email: this.email.value,
            active: this.active.value
        }
    }
}

const user = new User(
    'user-1',
    { value: 'Ana' },
    Email.from('ana@example.com'),
    NullableBoolean.from(true)
)

const json = user.toJSON()
```

The result uses the internal values of `UserName`, `Email`, and `NullableBoolean`.

### Aggregates

An aggregate groups multiple entities into a logical unit. The aggregate's operations depend on all the identities that compose it.

A user list can group several users:

```text
UserList
└── items
```

Each element preserves its own identity within the unit.

```ts
import { Aggregate } from '../../shared/domain/aggregates.js'

type User = {
    id: string
}

export class UserList extends Aggregate {
    public constructor(public readonly items: User[]) {
        super()
    }

    public count(): number {
        return this.items.length
    }
}
```

`UserList` groups multiple `User` entities into a single logical unit. The `count()` method operates on that group.

### Domain errors

The `shared/domain/errors.ts` file generates `ValueError`. This error represents a received value that does not satisfy the expected rule.

```ts
import { ValueError } from '../../shared/domain/errors.js'

if (userId.trim().length === 0) {
    throw new ValueError(userId, 'UserId')
}
```

Because it is in `shared`, `ValueError` can be used from any context and by any domain concept that validates values.

## Shared application

The application layer coordinates use cases. Its contracts connect the domain with validations, data sources, HTTP responses, logs, and events.

### Validations

The `shared/application/validations.ts` file declares the `Validatable` contract:

```ts
isValid(): boolean
```

`isValid()` checks whether the data is valid according to the rule defined by the implementation.

We will create a validation for the use case that registers users.

```ts
import type { Validatable } from '../../shared/application/validations.js'
import { Email } from '../../shared/domain/value-objects.js'

export type CreateUserValidationData = {
    name: string
    email: string
}

export class CreateUserValidation implements Validatable {
    public constructor(
        private readonly data: CreateUserValidationData
    ) {}

    public isValid(): boolean {
        return this.data.name.trim().length > 0 &&
            Email.isValid(this.data.email)
    }
}
```

In this example, the application service runs this validation before constructing the `User` entity.

### Services

Services represent application use cases. Each service applies domain capabilities in a process that fulfills a purpose, such as creating a user, confirming an order, or recording a payment.

The `shared/application/services.ts` file generates the `Service` base class. A concrete implementation defines its inputs, dependencies, and the method that executes the process.

We will begin with a service that creates a user.

```ts
import type { Validatable } from '../../shared/application/validations.js'
import { Service } from '../../shared/application/services.js'
import {
    Email,
    NullableBoolean
} from '../../shared/domain/value-objects.js'

type CreateUserValidationData = {
    name: string
    email: string
}

class CreateUserValidation implements Validatable {
    public constructor(
        private readonly data: CreateUserValidationData
    ) {}

    public isValid(): boolean {
        return this.data.name.trim().length > 0 &&
            Email.isValid(this.data.email)
    }
}

class UserName {
    public constructor(public readonly value: string) {}

    public static from(value: string): UserName {
        return new UserName(value.trim())
    }
}

class User {
    public constructor(
        public readonly id: string,
        public readonly name: UserName,
        public readonly email: Email,
        public readonly active: NullableBoolean
    ) {}
}

export interface UserWriter {
    save(user: User): Promise<void>
}

export type CreateUserCommand = {
    id: string
    name: string
    email: string
}

export type CreatedUser = {
    id: string
    name: string
    email: string
    active: boolean | null
}

export class CreateUserService extends Service {
    public constructor(private readonly users: UserWriter) {
        super()
    }

    public async execute(
        command: CreateUserCommand
    ): Promise<CreatedUser> {
        const validation = new CreateUserValidation({
            name: command.name,
            email: command.email
        })

        if (validation.isValid() === false) {
            throw new Error('The name or email is invalid.')
        }

        const user = new User(
            command.id,
            UserName.from(command.name),
            Email.from(command.email),
            NullableBoolean.from(true)
        )

        await this.users.save(user)

        return {
            id: user.id,
            name: user.name.value,
            email: user.email.value,
            active: user.active.value
        }
    }
}
```

In this example, the service receives a command, validates the input, constructs the entity, and delegates persistence. `CreateUserCommand` is one possible input shape, and `CreatedUser` is one possible output shape.

### HTTP responses

The `shared/application/http.ts` file generates lightweight HTTP contracts: `HttpRequest`, `HttpResponse`, `HttpResponseBody`, `HttpRequestHandler`, and `HttpMiddleware`.

`HttpResponseBody` is an interface organized into three properties:

```ts
import type { HttpResponseBody } from '../../shared/application/http.js'

const body: HttpResponseBody = {
    data,
    errors,
    links
}
```

`data` contains the operation data and accepts `null` when the response has no data:

```ts
const body: HttpResponseBody = {
    data: {
        id: 'user-1',
        name: 'Ana'
    },
    errors: null,
    links: null
}
```

`errors` contains a list of messages:

```ts
const body: HttpResponseBody = {
    data: null,
    errors: ['The email is invalid.'],
    links: null
}
```

`links` contains HATEOAS links related to the resource and its available operations:

```ts
const body: HttpResponseBody = {
    data: {
        id: 'user-1',
        name: 'Ana'
    },
    errors: null,
    links: {
        self: new URL('https://api.example.com/users/user-1')
    }
}
```

An entity's plain output can be used as `data`:

```ts
const body: HttpResponseBody = {
    data: user.toJSON(),
    errors: null,
    links: null
}
```

`HttpRequestHandler` and `HttpMiddleware` define the contracts for adapters that receive a request, delegate to a handler, and produce a response.

### Logs

The `shared/application/loggers.ts` file declares the `Logger` contract. The application uses this abstraction to produce logs that an adapter sends to external services.

The contract includes the `debug`, `info`, `warning`, `error`, and `critical` levels, together with the numeric constants `DEBUG`, `INFO`, `WARNING`, `ERROR`, and `CRITICAL`.

We will create a simple adapter that connects the contract to the console.

```ts
import { Logger } from '../../shared/application/loggers.js'

export class ConsoleLoggerAdapter extends Logger {
    public debug(data: unknown): void {
        console.debug(data)
    }

    public info(data: unknown): void {
        console.info(data)
    }

    public warning(data: unknown): void {
        console.warn(data)
    }

    public error(data: unknown): void {
        console.error(data)
    }

    public critical(data: unknown): void {
        console.error(data)
    }
}
```

In this example, the service receives `Logger` as a dependency. The adapter decides where to send each level.

### Events

The `shared/application/events.ts` file contains the contracts that connect the application to an event bus.

The flow starts with an event, continues through the dispatcher, and ends in one or more handlers:

```text
Service
    ↓ creates
Event
    ↓ passes to
EventDispatcher
    ↓ publishes to
Event bus
    ↓ executes
EventHandler
```

#### Event

`Event` represents something that occurred in the application. It contains the event time and its plain details.

```ts
import { Event } from '../../shared/application/events.js'

export class UserCreated extends Event {
    public constructor(userId: string) {
        super(Date.now(), { userId })
    }
}
```

#### Handler

`EventHandler` represents a reaction to the event.

```ts
import {
    Event,
    EventHandler
} from '../../shared/application/events.js'
import { Logger } from '../../shared/application/loggers.js'

export class LogUserCreated extends EventHandler {
    public constructor(private readonly logger: Logger) {
        super()
    }

    public async handle(event: Event): Promise<void> {
        this.logger.info(event.details)
    }
}
```

#### Dispatcher

`EventDispatcher` represents the interaction contract with the event bus. Its concrete implementation subscribes handlers, removes subscriptions, and dispatches events.

```ts
subscribe(key, handler)
unsubscribe(key, handler)
dispatch(event)
```

In one possible implementation, the service can receive `EventDispatcher` and publish `UserCreated` after completing the use case.

## Data sources

The `shared/application/data/` directory organizes access to a data source into three modules: `drivers.ts`, `managers.ts`, and `repositories.ts`. Together, they define `DriverAdapter`, `DataManager`, `DatasetManager`, and `Repository`.

The complete flow looks like this:

```text
DriverAdapter
    ↓ connects and enables
DataManager or DatasetManager
    ↓ provides plain data to
Repository
    ↓ transforms
Domain objects
    ↓ used by
Service
```

We will begin with the connection and proceed to the use case.

### Driver adapter

`DriverAdapter` connects and disconnects the source through a driver. When the connection is available, `connect()` returns an enabled data manager.

```ts
connect(...args): Promise<DataManager>
disconnect(): Promise<unknown>
```

We will create an adapter for an in-memory collection of users. This example avoids a database so the focus stays on the adapter's responsibility, not on infrastructure details.

```ts
import { DriverAdapter } from '../../shared/application/data/drivers.js'

type UserRecord = {
    id: string
    name: string
    email: string
    active: boolean | null
}

class UserDataManager {
    public constructor(private readonly records: UserRecord[]) {}

    public async all(): Promise<UserRecord[]> {
        return this.records
    }
}

export class UserDriverAdapter
    extends DriverAdapter<UserDataManager> {

    public constructor(private readonly records: UserRecord[]) {
        super()
    }

    public async connect(): Promise<UserDataManager> {
        return new UserDataManager(this.records)
    }

    public async disconnect(): Promise<void> {
    }
}
```

The concrete implementation can encapsulate a database driver, an HTTP client, a file system, or another source.

### Data manager

`DataManager` operates on the source and works with plain objects and arrays. Its base form defines two operations:

```ts
all(): Promise<Array<T>>
none(): Array<T>
```

`all()` retrieves the available records. `none()` creates an empty typed collection.

First, we will define the shape used by the source:

```ts
type UserRecord = {
    id: string
    name: string
    email: string
    active: boolean | null
}
```

Now we will implement the data manager.

```ts
import { DataManager } from '../../shared/application/data/managers.js'

export type UserRecord = {
    id: string
    name: string
    email: string
    active: boolean | null
}

export class UserDataManager
    extends DataManager<UserRecord> {

    public constructor(private readonly records: UserRecord[]) {
        super()
    }

    public async all(): Promise<UserRecord[]> {
        return this.records
    }

    public none(): UserRecord[] {
        return []
    }
}
```

The data manager reflects the structure of the source. In this example, it only exposes plain records.

#### Source operations

The file also declares interfaces that extend a data manager's capabilities:

| Interface | Operation |
| --- | --- |
| `Filterable` | Filters records. |
| `Sortable` | Sorts records. |
| `Creatable` | Creates records. |
| `Updatable` | Updates records. |
| `Deletable` | Deletes records. |
| `Aggregatable` | Performs aggregations. |
| `Relatable` | Selects or preloads relationships. |

A data manager can implement the interfaces required by its source:

```ts
import {
    Creatable,
    DataManager,
    Filterable
} from '../../shared/application/data/managers.js'

export class UserDataManager
    extends DataManager<UserRecord>
    implements
        Filterable<Partial<UserRecord>>,
        Creatable<UserRecord> {

    public constructor(private readonly records: UserRecord[]) {
        super()
    }

    public async all(): Promise<UserRecord[]> {
        return this.records
    }

    public none(): UserRecord[] {
        return []
    }

    public async filter(
        selector: Partial<UserRecord>
    ): Promise<UserRecord[]> {
        return this.records.filter((record) =>
            (selector.id === undefined || record.id === selector.id) &&
            (selector.email === undefined || record.email === selector.email)
        )
    }

    public async create(data: UserRecord): Promise<void> {
        this.records.push(data)
    }
}
```

It can also declare operations specific to source queries:

```ts
public async findByEmail(email: string): Promise<UserRecord[]> {
    return this.filter({ email })
}
```

The application layer decides when to execute these operations, combines their results, and catches errors produced by the source.

### Dataset manager

`DatasetManager` extends `DataManager` with set operations:

```ts
union()
intersection()
difference()
symmetricDifference()
complement()
```

This implementation is useful when an operation works with unions, intersections, differences, and complements between data collections.

### Repository

`Repository` acts as an intermediary between plain data and domain objects.

```text
UserRecord
    ↓ transform
User

User
    ↓ toRecord
UserRecord
```

In this example, the source and the domain have nearly the same shape so the focus stays on the repository's role: translating between plain data and domain objects.

Now we will implement the repository.

```ts
import { DriverAdapter } from '../../shared/application/data/drivers.js'
import {
    Creatable,
    DataManager
} from '../../shared/application/data/managers.js'
import { Repository } from '../../shared/application/data/repositories.js'
import {
    Email,
    NullableBoolean
} from '../../shared/domain/value-objects.js'

type UserRecord = {
    id: string
    name: string
    email: string
    active: boolean | null
}

interface UsersReader {
    findAll(): Promise<User[]>
}

class UserName {
    public constructor(public readonly value: string) {}

    public static from(value: string): UserName {
        return new UserName(value)
    }
}

class User {
    public constructor(
        public readonly id: string,
        public readonly name: UserName,
        public readonly email: Email,
        public readonly active: NullableBoolean
    ) {}
}

class UserDataManager extends DataManager<UserRecord> {
    public constructor(private readonly records: UserRecord[]) {
        super()
    }

    public async all(): Promise<UserRecord[]> {
        return this.records
    }

    public none(): UserRecord[] {
        return []
    }
}

class UserDriverAdapter extends DriverAdapter<UserDataManager> {
    public constructor(private readonly records: UserRecord[]) {
        super()
    }

    public async connect(): Promise<UserDataManager> {
        return new UserDataManager(this.records)
    }

    public async disconnect(): Promise<void> {
    }
}

type WritableUserDataManager =
    DataManager<UserRecord> &
    Creatable<UserRecord>

export class UserRepository
    extends Repository<UserRecord, User>
    implements UsersReader {

    public constructor(records: UserRecord[]) {
        super(new UserDriverAdapter(records))
    }

    protected override transform(data: UserRecord): User {
        return new User(
            data.id,
            UserName.from(data.name),
            Email.from(data.email),
            NullableBoolean.from(data.active)
        )
    }

    public async findAll(): Promise<User[]> {
        return this.all()
    }

    public async save(user: User): Promise<void> {
        const dataManager = await this.driver.connect()
        const writable = dataManager as WritableUserDataManager

        await writable.create({
            id: user.id,
            name: user.name.value,
            email: user.email.value,
            active: user.active.value
        })

        await this.driver.disconnect()
    }
}
```

Here, `transform()` converts the record into an entity. The repository constructor receives a concrete `DriverAdapter`, and the inherited `all()` method handles the connect, read, transform, and disconnect flow for this example.

### Queries and errors in the application

Application services coordinate queries and catch errors from data sources. The process expresses the collaboration capabilities it needs through application-specific contracts. Adapters materialize those contracts.

```ts
import { Service } from '../../shared/application/services.js'

type User = {
    id: string
}

export interface UsersReader {
    findAll(): Promise<User[]>
}

export class ListUsersService extends Service {
    public constructor(private readonly users: UsersReader) {
        super()
    }

    public async execute(): Promise<User[]> {
        try {
            return await this.users.findAll()
        } catch {
            throw new Error('Could not list users.')
        }
    }
}
```

`UsersReader` expresses the collaboration required by the process. `UserRepository`, located in `adapters`, implements that collaboration and transforms source data into `User` entities.

## Context ports

Ports describe communication between the context and other systems. Each port defines the shape of an interaction at the boundary: input data, output data, and the available operation.

The context generates `example-ports.ts` as a root-level starting point. As the context grows, you can add `index.ts` as the main port file or split ports across multiple `.ts` files. Adapters import the ports that define the communication they materialize.

### Main port

If you want a main port file, you can declare the communication for creating a user at the context root.

```ts
export type CreateUserRequest = {
    id: string
    name: string
    email: string
}

export type CreateUserResponse = {
    id: string
    name: string
    email: string
    active: boolean | null
}

export interface CreateUserPort {
    create(
        request: CreateUserRequest
    ): Promise<CreateUserResponse>
}
```

`CreateUserRequest` represents the information received from another system. `CreateUserResponse` represents the returned response. `CreateUserPort` defines the operation available at the context boundary.

### Adapt the port to the application process

In this example, the adapter imports the port and the service. Its job here is to translate the external request into the application command and transform the result into the port response.

```ts
type CreateUserRequest = {
    id: string
    name: string
    email: string
}

type CreateUserResponse = {
    id: string
    name: string
    email: string
    active: boolean | null
}

type CreateUserCommand = CreateUserRequest

interface CreateUserPort {
    create(
        request: CreateUserRequest
    ): Promise<CreateUserResponse>
}

interface CreateUserService {
    execute(command: CreateUserCommand): Promise<CreateUserResponse>
}

export class CreateUserAdapter implements CreateUserPort {
    public constructor(
        private readonly service: CreateUserService
    ) {}

    public async create(
        request: CreateUserRequest
    ): Promise<CreateUserResponse> {
        const command: CreateUserCommand = {
            id: request.id,
            name: request.name,
            email: request.email
        }

        const result = await this.service.execute(command)

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            active: result.active
        }
    }
}
```

In this example, the port expresses the communication, the adapter implements it, the service executes the process, and the domain provides the capabilities used by that process.

### Additional ports

A context can organize its communications across several files at the root. Each file declares the ports for a group of interactions.

```ts
export type ListUsersResponse = Array<{
    id: string
    name: string
    email: string
    active: boolean | null
}>

export interface ListUsersPort {
    list(): Promise<ListUsersResponse>
}
```

An adapter can import the contract from the file where it is declared:

```ts
import type {
    ListUsersPort,
    ListUsersResponse
} from '../example-ports.js'
```

> **Tip:** group ports that form a coherent communication in the same file. Use additional files when the context grows and groups of interactions with their own responsibilities emerge.

## Generated file reference

| File | Purpose |
| --- | --- |
| `core/index.d.ts` | Declares `Generic<T>` for plain objects. |
| `core/main.ts` | Placeholder for the library's main implementation and exports. |
| `shared/domain/value-objects.ts` | Declares `ValueObject<T>` and implements `Email` and `NullableBoolean`. |
| `shared/domain/entities.ts` | Declares the `Entity` base class. |
| `shared/domain/aggregates.ts` | Declares the `Aggregate` base class. |
| `shared/domain/errors.ts` | Implements `ValueError`. |
| `shared/application/validations.ts` | Declares `Validatable`. |
| `shared/application/services.ts` | Declares `Service` as the base class for use cases. |
| `shared/application/http.ts` | Declares HTTP request, response, body, handler, and middleware contracts. |
| `shared/application/loggers.ts` | Declares log levels and the `Logger` contract. |
| `shared/application/events.ts` | Declares `Event`, `EventHandler`, and `EventDispatcher`. |
| `shared/application/data/drivers.ts` | Declares the `DriverAdapter` contract used to connect to a data source. |
| `shared/application/data/managers.ts` | Declares source operations together with `DataManager` and `DatasetManager`. |
| `shared/application/data/repositories.ts` | Declares the `Repository` base class for transforming records into domain objects. |
| `users/example-ports.ts` | Provides a root-level starter file for declaring context ports. |
| `users/domain/` | Contains the context's capabilities. |
| `users/application/` | Contains processes that apply domain capabilities to fulfill purposes. |
| `users/adapters/` | Contains integrations that import ports and connect the context with other systems. |
