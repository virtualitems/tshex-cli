# Hexagonal Architecture CLI `tshex-cli`

`tshex-cli` creates the base structure of a library organized by contexts. The structure groups shared contracts, domain concepts, use cases, and adapters into directories with defined responsibilities.

In this guide, we will build a library named `core` with a context named `users`. The walkthrough starts with the CLI and continues with the implementation of each generated component.

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
│   │   ├── data-sources.ts
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
    ├── example-ports.ts
    └── index.ts
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

The root contains `index.ts` and other `.ts` files intended for the context's ports.

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

A port declares the communication available at the context boundary: what data enters, what data leaves, and which operation is exposed. Ports are declared in `index.ts` or in `.ts` modules located at the context root.

An adapter implements that communication. It imports the corresponding port, translates external input or output into the application process format, and delegates the work to the application service.

The import direction follows this path:

```text
adapter → port
adapter → application
application → domain
```

For example, `users/index.ts` declares the `CreateUserPort` port. `users/adapters/create-user-adapter.ts` imports that port and connects an external request to `users/application/create-user-service.ts`. The service applies the capabilities of `Email` and `User` to complete the registration.

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

const email = Email.from('alejandro@example.com')

email.value
email.domain
```

Creation is performed with `Email.from()`. This method runs `Email.isValid()` before constructing the instance.

```ts
Email.isValid('alejandro@example.com')
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

const status = NullableBoolean.from(null)

status.value
status.isIndeterminate()
```

The `isIndeterminate()` method expresses an operation specific to the concept and allows the `null` state to be checked with explicit intent.

#### Implement a value object

We will create a discount percentage. The example has only one rule and one operation so the focus remains on the value object concept.

**`sales/domain/discount-percentage.ts`**

```ts
import { ValueError } from '../../shared/domain/errors.js'
import { ValueObject } from '../../shared/domain/value-objects.js'

export class DiscountPercentage extends ValueObject<number> {
    public override readonly value: number

    protected constructor(value: number) {
        super()
        this.value = value
    }

    public override equals(
        other: DiscountPercentage | null | undefined
    ): boolean {
        return other instanceof DiscountPercentage &&
            this.value === other.value
    }

    public applyTo(amount: number): number {
        return amount - amount * (this.value / 100)
    }

    public static override isValid(value: unknown): boolean {
        return typeof value === 'number' &&
            Number.isFinite(value) &&
            value >= 0 &&
            value <= 100
    }

    public static from(value: number): DiscountPercentage {
        if (this.isValid(value) === false) {
            throw new ValueError(String(value), this.name)
        }

        return new this(value)
    }
}
```

Now we can create and use the concept:

```ts
const discount = DiscountPercentage.from(15)
const finalPrice = discount.applyTo(100)
```

`isValid()` centralizes the rule. `from()` creates the valid instance. `applyTo()` adds behavior specific to the concept.

### Entities

An entity represents a concept with its own identity. Two instances represent the same element when they share that identity.

The `shared/domain/entities.ts` file generates the `Entity` base class. Each entity implements `equals()` and `toJSON()`.

We will create an entity for the `users` context.

**`users/domain/user.ts`**

```ts
import { Entity } from '../../shared/domain/entities.js'
import {
    Email,
    NullableBoolean
} from '../../shared/domain/value-objects.js'

export class User extends Entity {
    public constructor(
        public readonly id: string,
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
            email: this.email.value,
            active: this.active.value
        }
    }
}
```

The `id` property defines the identity. The `equals()` method compares entities using that property.

`toJSON()` produces a plain representation of the entity:

```ts
const user = new User(
    'user-1',
    Email.from('alejandro@example.com'),
    NullableBoolean.from(true)
)

const json = user.toJSON()
```

The result uses the internal values of `Email` and `NullableBoolean`.

### Aggregates

An aggregate groups multiple entities into a logical unit. The aggregate's operations depend on all the identities that compose it.

A team can group one leader and several members:

```text
Team
├── leader
└── members
```

Each element preserves its own identity within the unit.

**`users/domain/team.ts`**

```ts
import { Aggregate } from '../../shared/domain/aggregates.js'
import type { User } from './user.js'

export class Team extends Aggregate {
    public constructor(
        public readonly leader: User,
        public readonly members: User[]
    ) {
        super()
    }

    public size(): number {
        return this.members.length + 1
    }
}
```

`Team` groups multiple `User` entities into a single logical unit. The `size()` method operates on that group.

### Domain errors

The `shared/domain/errors.ts` file generates `ValueError`. This error represents a received value that does not satisfy the expected rule.

```ts
import { ValueError } from '../../shared/domain/errors.js'

if (quantity <= 0) {
    throw new ValueError(String(quantity), 'PositiveQuantity')
}
```

Because it is in `shared`, `ValueError` can be used from any context and by any domain concept that validates values.

## Shared application

The application layer coordinates use cases. Its contracts connect the domain with validations, data sources, HTTP responses, logs, and events.

### Validations

The `shared/application/validations.ts` file declares the `Validatable` contract:

```ts
isValid(): boolean
validate(): unknown
```

`isValid()` checks the validation state. `validate()` performs the validation and returns the result defined by the implementation.

We will create a validation for the use case that registers users.

**`users/application/create-user-validation.ts`**

```ts
import type { Validatable } from '../../shared/application/validations.js'
import { Email } from '../../shared/domain/value-objects.js'

export class CreateUserValidation implements Validatable {
    public constructor(private readonly email: string) {}

    public isValid(): boolean {
        return Email.isValid(this.email)
    }

    public validate(): string[] {
        return this.isValid()
            ? []
            : ['The email is invalid.']
    }
}
```

The application service can run this validation before constructing the `User` entity.

### Services

Services represent application use cases. Each service applies domain capabilities in a process that fulfills a purpose, such as creating a user, confirming an order, or recording a payment.

The `shared/application/services.ts` file generates the `Service` base class. A concrete implementation defines its inputs, dependencies, and the method that executes the process.

We will begin with a service that creates a user.

**`users/application/create-user-service.ts`**

```ts
import { Service } from '../../shared/application/services.js'
import {
    Email,
    NullableBoolean
} from '../../shared/domain/value-objects.js'
import { User } from '../domain/user.js'
import { CreateUserValidation } from './create-user-validation.js'

export interface UserWriter {
    save(user: User): Promise<void>
}

export type CreateUserCommand = {
    id: string
    email: string
}

export type CreatedUser = {
    id: string
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
        const validation = new CreateUserValidation(command.email)
        const errors = validation.validate()

        if (errors.length !== 0) {
            throw new Error(errors.join(', '))
        }

        const user = new User(
            command.id,
            Email.from(command.email),
            NullableBoolean.from(true)
        )

        await this.users.save(user)

        return {
            id: user.id,
            email: user.email.value,
            active: user.active.value
        }
    }
}
```

The service receives a command, validates the input, constructs the entity, and delegates persistence. `CreateUserCommand` expresses the process input. `CreatedUser` expresses the output.

### HTTP responses

The `shared/application/http.ts` file generates `HttpResponseBody`, a response body designed for REST APIs.

The class organizes the response into three properties:

```ts
new HttpResponseBody(data, errors, links)
```

`data` contains the operation data and accepts `null` when the response has no data:

```ts
const body = new HttpResponseBody({ id: 'user-1' })
```

`errors` contains a list of messages:

```ts
const body = new HttpResponseBody(
    null,
    ['The email is invalid.']
)
```

`links` contains HATEOAS links related to the resource and its available operations:

```ts
const body = new HttpResponseBody(
    { id: 'user-1' },
    null,
    {
        self: new URL('https://api.example.com/users/user-1')
    }
)
```

An entity's plain output can be used as `data`:

```ts
const body = new HttpResponseBody(user.toJSON())
```

### Logs

The `shared/application/loggers.ts` file declares the `Logger` contract. The application uses this abstraction to produce logs that an adapter sends to external services.

The contract includes the `debug`, `info`, `warning`, `error`, and `critical` levels, together with the numeric constants `DEBUG`, `INFO`, `WARNING`, `ERROR`, and `CRITICAL`.

We will create a simple adapter that connects the contract to the console.

**`users/adapters/console-logger-adapter.ts`**

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

The service receives `Logger` as a dependency. The adapter decides where to send each level.

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

**`users/application/user-created.ts`**

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

**`users/application/log-user-created.ts`**

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

The service can receive `EventDispatcher` and publish `UserCreated` after completing the use case.

## Data sources

The `shared/application/data-sources.ts` file organizes access to a data source into four components: `DriverManager`, `DataManager`, `DatasetManager`, and `Repository`.

The complete flow looks like this:

```text
DriverManager
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

### Driver manager

`DriverManager` connects and disconnects the source through a driver. When the connection is available, `connect()` returns an enabled data manager.

```ts
connect(...args): Promise<DataManager>
disconnect(): Promise<unknown>
```

We will create a manager for an in-memory collection of people. The example avoids a database so the focus remains on the manager's responsibility.

**`users/adapters/people-driver-manager.ts`**

```ts
import { DriverManager } from '../../shared/application/data-sources.js'
import { PeopleDataManager } from './people-data-manager.js'

export type PersonRecord = {
    id: string
    name: string
}

export class PeopleDriverManager
    extends DriverManager<PeopleDataManager> {

    public constructor(private readonly records: PersonRecord[]) {
        super()
    }

    public async connect(): Promise<PeopleDataManager> {
        return new PeopleDataManager(this.records)
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
type PersonRecord = {
    id: string
    name: string
}
```

Now we will implement the data manager.

**`users/adapters/people-data-manager.ts`**

```ts
import { DataManager } from '../../shared/application/data-sources.js'

export type PersonRecord = {
    id: string
    name: string
}

export class PeopleDataManager
    extends DataManager<PersonRecord> {

    public constructor(private readonly records: PersonRecord[]) {
        super()
    }

    public async all(): Promise<PersonRecord[]> {
        return this.records
    }

    public none(): PersonRecord[] {
        return []
    }
}
```

The data manager reflects the structure of the source. In this example, it only provides plain records.

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
} from '../../shared/application/data-sources.js'

export class PeopleDataManager
    extends DataManager<PersonRecord>
    implements
        Filterable<Partial<PersonRecord>>,
        Creatable<PersonRecord> {

    public constructor(private readonly records: PersonRecord[]) {
        super()
    }

    public async all(): Promise<PersonRecord[]> {
        return this.records
    }

    public none(): PersonRecord[] {
        return []
    }

    public async filter(
        selector: Partial<PersonRecord>
    ): Promise<PersonRecord[]> {
        return this.records.filter((record) =>
            (selector.id === undefined || record.id === selector.id) &&
            (selector.name === undefined || record.name === selector.name)
        )
    }

    public async create(data: PersonRecord): Promise<void> {
        this.records.push(data)
    }
}
```

It can also declare operations specific to source queries:

```ts
public async findByName(name: string): Promise<PersonRecord[]> {
    return this.filter({ name })
}
```

The application layer decides when to execute these operations, combines their results, and catches errors produced by the source.

### Dataset manager

`DatasetManager` extends `DataManager` with set operations:

```ts
union()
intersection()
difference()
symmetric_difference()
complement()
```

This implementation is useful when an operation works with unions, intersections, differences, and complements between data collections.

### Repository

`Repository` acts as an intermediary between plain data and domain objects.

```text
PersonRecord
    ↓ transform
Person

Person
    ↓ toRecord
PersonRecord
```

In this example, the source and the domain have nearly the same shape so the focus remains on the repository's role: translating between plain data and domain objects.

**`users/domain/person.ts`**

```ts
import { Entity } from '../../shared/domain/entities.js'

export class Person extends Entity {
    public constructor(
        public readonly id: string,
        public readonly name: string
    ) {
        super()
    }

    public override equals(other: Entity): boolean {
        return other instanceof Person && other.id === this.id
    }

    public override toJSON(): Record<string, unknown> {
        return {
            id: this.id,
            name: this.name
        }
    }
}
```

Now we will implement the repository.

**`users/adapters/people-repository.ts`**

```ts
import { Repository } from '../../shared/application/data-sources.js'
import type { PeopleReader } from '../application/list-people-service.js'
import { Person } from '../domain/person.js'
import type { PersonRecord } from './people-data-manager.js'
import { PeopleDriverManager } from './people-driver-manager.js'

export class PeopleRepository
    extends Repository<PeopleDriverManager>
    implements PeopleReader {

    protected transform<T = Person>(data: Generic): T {
        const record = data as PersonRecord

        return new Person(record.id, record.name) as T
    }

    private toRecord(person: Person): PersonRecord {
        return {
            id: person.id,
            name: person.name
        }
    }

    public async findAll(): Promise<Person[]> {
        const dataManager = await this.manager.connect()
        const records = await dataManager.all()

        return records.map((record) =>
            this.transform<Person>(record)
        )
    }

    public async save(person: Person): Promise<void> {
        const dataManager = await this.manager.connect()

        await dataManager.create(this.toRecord(person))
    }
}
```

`transform()` converts the record into an entity. `toRecord()` performs the reverse conversion.

### Queries and errors in the application

Application services coordinate queries and catch errors from data sources. The process expresses the collaboration capabilities it needs through application-specific contracts. Adapters materialize those contracts.

**`users/application/list-people-service.ts`**

```ts
import { Service } from '../../shared/application/services.js'
import type { Person } from '../domain/person.js'

export interface PeopleReader {
    findAll(): Promise<Person[]>
}

export class ListPeopleService extends Service {
    public constructor(private readonly people: PeopleReader) {
        super()
    }

    public async execute(): Promise<Person[]> {
        try {
            return await this.people.findAll()
        } catch {
            throw new Error('Could not list people.')
        }
    }
}
```

`PeopleReader` expresses the collaboration required by the process. `PeopleRepository`, located in `adapters`, implements that collaboration and transforms source data into `Person` entities.

## Context ports

Ports describe communication between the context and other systems. Each port defines the shape of an interaction at the boundary: input data, output data, and the available operation.

The context generates `index.ts` as the main port file and `example-ports.ts` as an example of an additional file. Adapters import the ports that define the communication they materialize.

### Main port

We will declare the communication for creating a user directly in `users/index.ts`.

**`users/index.ts`**

```ts
export type CreateUserRequest = {
    id: string
    email: string
}

export type CreateUserResponse = {
    id: string
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

The adapter imports the port and the service. Its responsibility is to translate the external request into the application command and transform the result into the port response.

**`users/adapters/create-user-adapter.ts`**

```ts
import type {
    CreateUserPort,
    CreateUserRequest,
    CreateUserResponse
} from '../index.js'
import {
    CreateUserService,
    type CreateUserCommand
} from '../application/create-user-service.js'

export class CreateUserAdapter implements CreateUserPort {
    public constructor(
        private readonly service: CreateUserService
    ) {}

    public async create(
        request: CreateUserRequest
    ): Promise<CreateUserResponse> {
        const command: CreateUserCommand = {
            id: request.id,
            email: request.email
        }

        const result = await this.service.execute(command)

        return {
            id: result.id,
            email: result.email,
            active: result.active
        }
    }
}
```

The port expresses the communication. The adapter implements it. The service executes the process. The domain provides the capabilities used by that process.

### Additional ports

A context can organize its communications across several files at the root. Each file declares the ports for a group of interactions.

**`users/example-ports.ts`**

```ts
export type FindUserRequest = {
    id: string
}

export type FindUserResponse = {
    id: string
    email: string
} | null

export interface FindUserPort {
    find(
        request: FindUserRequest
    ): Promise<FindUserResponse>
}
```

The corresponding adapter imports the contract from the file where it is declared:

```ts
import type {
    FindUserPort,
    FindUserRequest,
    FindUserResponse
} from '../example-ports.js'
```

> **Tip:** group ports that form a coherent communication in the same file. Use additional files when the context grows and groups of interactions with their own responsibilities emerge.

## Implement a context

We will now walk through a complete implementation of `users`, following the layer order: capabilities, process, and communication.

### 1. Model the domain capabilities

We begin with concepts that have rules and behavior. We use `Email` for the email address, `string` for identity, and an entity for the user.

**`users/domain/user.ts`**

```ts
import { Entity } from '../../shared/domain/entities.js'
import {
    Email,
    NullableBoolean
} from '../../shared/domain/value-objects.js'

export class User extends Entity {
    public constructor(
        public readonly id: string,
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
            email: this.email.value,
            active: this.active.value
        }
    }
}
```

`Email` provides the capability to validate and represent the email address. `User` provides user identity and representation.

### 2. Implement process validation

The validation prepares the input used by the use case.

**`users/application/create-user-validation.ts`**

```ts
import type { Validatable } from '../../shared/application/validations.js'
import { Email } from '../../shared/domain/value-objects.js'

export class CreateUserValidation implements Validatable {
    public constructor(private readonly email: string) {}

    public isValid(): boolean {
        return Email.isValid(this.email)
    }

    public validate(): string[] {
        return this.isValid()
            ? []
            : ['The email is invalid.']
    }
}
```

### 3. Implement the application process

The service receives its collaborators as dependencies and applies domain capabilities to complete the registration.

**`users/application/create-user-service.ts`**

```ts
import { Service } from '../../shared/application/services.js'
import {
    Email,
    NullableBoolean
} from '../../shared/domain/value-objects.js'
import { User } from '../domain/user.js'
import { CreateUserValidation } from './create-user-validation.js'

export interface UserWriter {
    save(user: User): Promise<void>
}

export type CreateUserCommand = {
    id: string
    email: string
}

export type CreatedUser = {
    id: string
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
        const validation = new CreateUserValidation(command.email)
        const errors = validation.validate()

        if (errors.length !== 0) {
            throw new Error(errors.join(', '))
        }

        const user = new User(
            command.id,
            Email.from(command.email),
            NullableBoolean.from(true)
        )

        await this.users.save(user)

        return {
            id: user.id,
            email: user.email.value,
            active: user.active.value
        }
    }
}
```

`UserWriter` declares the operation the service requires from the adapter. The flow has four steps: validate, construct the entity, save, and respond.

### 4. Declare the communication port

The port defines how another system requests user creation.

**`users/index.ts`**

```ts
export type CreateUserRequest = {
    id: string
    email: string
}

export type CreateUserResponse = {
    id: string
    email: string
    active: boolean | null
}

export interface CreateUserPort {
    create(
        request: CreateUserRequest
    ): Promise<CreateUserResponse>
}
```

### 5. Implement the adapter

The adapter imports the port, receives the external request, and executes the application process.

**`users/adapters/create-user-adapter.ts`**

```ts
import type {
    CreateUserPort,
    CreateUserRequest,
    CreateUserResponse
} from '../index.js'
import {
    CreateUserService,
    type CreateUserCommand
} from '../application/create-user-service.js'

export class CreateUserAdapter implements CreateUserPort {
    public constructor(
        private readonly service: CreateUserService
    ) {}

    public async create(
        request: CreateUserRequest
    ): Promise<CreateUserResponse> {
        const command: CreateUserCommand = {
            id: request.id,
            email: request.email
        }

        const result = await this.service.execute(command)

        return {
            id: result.id,
            email: result.email,
            active: result.active
        }
    }
}
```

The complete communication follows this path:

```text
External request
      ↓
CreateUserAdapter
      ↓
CreateUserService
      ↓
Validation + Email + User
      ↓
     UserWriter
      ↓
External response
```

### 6. Compose the implementation in `main.ts`

`main.ts` brings together the library's main implementations. The composition creates the service and provides it to the adapter.

**`core/main.ts`**

```ts
import { CreateUserService } from './users/application/create-user-service.js'
import { CreateUserAdapter } from './users/adapters/create-user-adapter.js'
import { InMemoryUserRepository } from './users/adapters/in-memory-user-repository.js'

export class CoreApplication {
    public readonly users: CreateUserAdapter

    public constructor() {
        const users = new InMemoryUserRepository()
        const createUserService = new CreateUserService(users)

        this.users = new CreateUserAdapter(createUserService)
    }
}
```

`CoreApplication` provides a minimal composition: a concrete repository, a service, and an adapter.

### 7. Use the implementation

The consumer uses the library's main entry point and accesses the adapter prepared in `main.ts`.

```ts
import { CoreApplication } from './core/main.js'

const core = new CoreApplication()

const result = await core.users.create({
    id: 'user-1',
    email: 'alejandro@example.com'
})
```

The adapter receives the request, applies the port, executes the service, and returns the response.

## Generated file reference

| File | Purpose |
| --- | --- |
| `core/index.d.ts` | Declares `Generic<T>` for plain objects. |
| `core/main.ts` | Contains the library's main implementation. |
| `shared/domain/value-objects.ts` | Declares `ValueObject<T>` and implements `Email` and `NullableBoolean`. |
| `shared/domain/entities.ts` | Declares the `Entity` base class. |
| `shared/domain/aggregates.ts` | Declares the `Aggregate` base class. |
| `shared/domain/errors.ts` | Implements `ValueError`. |
| `shared/application/validations.ts` | Declares `Validatable`. |
| `shared/application/services.ts` | Declares `Service` as the base class for use cases. |
| `shared/application/http.ts` | Implements `HttpResponseBody` for REST responses and HATEOAS links. |
| `shared/application/loggers.ts` | Declares log levels and the `Logger` contract. |
| `shared/application/events.ts` | Declares `Event`, `EventHandler`, and `EventDispatcher`. |
| `shared/application/data-sources.ts` | Declares source operations, managers, and repositories. |
| `users/index.ts` | Declares the context's main communication ports. |
| `users/example-ports.ts` | Shows an additional communication port file. |
| `users/domain/` | Contains the context's capabilities. |
| `users/application/` | Contains processes that apply domain capabilities to fulfill purposes. |
| `users/adapters/` | Contains integrations that import ports and connect the context with other systems. |
