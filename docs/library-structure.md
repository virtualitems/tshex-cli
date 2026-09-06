### Library Structure

The library structure organizes generated code into root files, shared
capabilities, and one or more contexts.
Each level has a distinct responsibility so that domain rules, use cases, and
integrations do not collapse into the same place.

This structure is used to keep the implementation centered on capabilities.
Shared code holds common abstractions. Contexts hold application-specific
language, rules, and operations.

#### Root

The root contains the entry points of the generated library.

```mermaid
flowchart TD
    root["Library root"] --> types["types/"]
    root --> main["main.ts"]
    root --> shared["shared/"]
    root --> students["students/"]
    root --> courses["courses/"]
    root --> enrollment["enrollment/"]
```

`types/` groups the root-level type declarations. `main.ts` wires the
dependency injection container and runs the application. The rest of the
structure lives under `shared/` and one or more context directories.

#### Types

The `types/` directory contains ambient type declarations shared by the whole
library.

```mermaid
flowchart TD
    types["types/"] --> typesObjects["objects.d.ts"]
    types --> json["json.d.ts"]
    types --> locales["locales.d.ts"]
    types --> timezones["timezones.d.ts"]
```

`types/objects.d.ts` defines root-level types such as `Generic<T>`.
`types/json.d.ts` defines `JsonValue` and the other plain, serializable JSON
shapes. `types/locales.d.ts` declares the `Locale` union from Unicode CLDR.
`types/timezones.d.ts` declares the `TimeZone` union from the IANA time zone
database.

#### Shared

The `shared` directory contains concepts that can be reused by multiple
contexts.

```mermaid
flowchart TD
    shared["shared/"] --> application["application/"]
    shared --> domain["domain/"]
    shared --> adapters["adapters/"]
```

`shared/domain` contains modeling foundations such as value objects, entities,
aggregates, and errors. `shared/application` contains contracts for services,
validations, events, logging, HTTP boundaries, and data access.
`shared/adapters` contains concrete adapter implementations shared across
contexts, such as the in-memory database driver and manager.

Move code to `shared` only when its meaning belongs to more than one context.
Until then, keep it close to the context that owns the rule.

#### Contexts

A context groups the vocabulary, rules, and operations of one application
capability.

```mermaid
flowchart TD
    contexts["Contexts"] --> students["students/"]
    contexts --> courses["courses/"]
    contexts --> enrollment["enrollment/"]
```

Each context can evolve independently while still reusing the abstractions from
`shared`. This separation reduces accidental coupling between unrelated parts of
the system.

#### Context Layout

Every generated context starts with the same internal structure.

```mermaid
flowchart TD
    enrollment["enrollment/"] --> ports["example.ts"]
    enrollment --> adapters["adapters/"]
    enrollment --> application["application/"]
    enrollment --> domain["domain/"]
```

`example.ts` is an example module in the root communication surface of
the context.
`domain/` contains capabilities and rules. `application/` contains processes.
`adapters/` contains integrations that wrap third-party libraries or context
ports.

Context root `.ts` files belong to the boundary surface of the context. Each
one is expected to be a module that defines one or more context ports.

#### Domain

The domain layer contains the context's capabilities.

This layer models concepts that carry business meaning: value objects, entities,
aggregates, and the rules that make them valid. The domain should not depend on
transport concerns or infrastructure details.

Typical domain responsibilities include validating an email address, identifying
an entity, changing the state of an order, or grouping related entities into a
single unit.

#### Application

The application layer contains processes that use domain capabilities to
fulfill a system purpose.

A service in this layer coordinates collaborators. It can validate input,
construct domain objects, read or write data through abstractions, publish an
event, and log the result.

The application layer is responsible for orchestration, not for owning the
business rules themselves.

#### Adapters

The adapters layer contains the integrations that connect a context to other
systems.

An adapter wraps a third-party library or a context port so that the context
can interact with a concrete transport or infrastructure path. An adapter can
expose an HTTP handler, consume a message, call a remote API, implement a data
driver, or connect to an event bus.

#### Ports

Ports define the communication available at the context boundary.

They live at the context root because they describe how the context is used
from the outside. A port is the concrete object the context exposes. Adapters
or other callers can use that port object and route work into an application
process.

The generated template starts with `example.ts`. As the context grows,
additional context root `.ts` modules can define more ports. The detailed
guidance for that layout lives in `context-ports.md`.

#### Dependency Direction

The normal dependency direction is the following:

```mermaid
flowchart LR
    adapter[Adapter] --> thirdParty["Third-party library"]
    adapter --> port[Port]
    port --> application[Application]
    application --> domain
```

This direction keeps the core model isolated from transport and infrastructure
details. Adapters integrate with external libraries and context ports. Ports
connect the context boundary to application processes. The deeper a layer is,
the less it should know about the outside.

> **Warning**
> Avoid importing adapter-specific concerns into the domain layer. Once a domain
> object depends on HTTP, database, or framework details, the context boundary
> becomes harder to change.

#### Example Flow

The following diagram shows the runtime flow of a typical operation.

```mermaid
flowchart TD
    main["main.ts"] --> system["Own system"]
    system --> application["Application services"]
    application --> domain["Domain capabilities"]
    system --> adapter[Adapters]
    adapter --> port[Port]
    adapter --> thirdParty["Third-party libraries"]
    thirdParty --> external["External systems"]
```

`main.ts` is the runtime entry point into the own system. Inside that system,
application services use domain capabilities, while adapters can depend on
ports and third-party libraries.

```ts title="main.ts"
import { Container } from './shared/application/providers.ts'
import { InMemoryDatabaseDriver } from './shared/adapters/database.ts'
import { InMemoryDatabaseManager } from './shared/adapters/managers.ts'
import { FileLogger } from './shared/adapters/loggers.ts'

import { StudentsRepository } from './students/application/repositories.ts'
import { StudentsService } from './students/application/services.ts'
import { Roster } from './students/students.ts'
import { Student } from './students/domain/students.ts'

import { CoursesRepository } from './courses/application/repositories.ts'
import { CoursesService } from './courses/application/services.ts'
import { Catalog } from './courses/courses.ts'
import { Course } from './courses/domain/courses.ts'

import { InscriptionsRepository } from './enrollment/application/repositories.ts'
import { InscriptionsService } from './enrollment/application/services.ts'
import { Enrollment } from './enrollment/enrollment.ts'

import { Email } from './shared/domain/value-objects.ts'

const logger = new FileLogger('app.log')

const container = new Container()

container.register({
    DatabaseDriver: { factory: () => new InMemoryDatabaseDriver({}) },

    StudentsManager: {
        factory: (r) => r.resolve<InMemoryDatabaseDriver>('DatabaseDriver').connect('students')
    },
    StudentsRepository: {
        factory: (r) => new StudentsRepository(r.resolve<InMemoryDatabaseManager>('StudentsManager'))
    },
    StudentsService: {
        factory: (r) => new StudentsService(
            r.resolve<InMemoryDatabaseManager>('StudentsManager'),
            r.resolve<StudentsRepository>('StudentsRepository')
        )
    },

    CoursesManager: {
        factory: (r) => r.resolve<InMemoryDatabaseDriver>('DatabaseDriver').connect('courses')
    },
    CoursesRepository: {
        factory: (r) => new CoursesRepository(r.resolve<InMemoryDatabaseManager>('CoursesManager'))
    },
    CoursesService: {
        factory: (r) => new CoursesService(
            r.resolve<InMemoryDatabaseManager>('CoursesManager'),
            r.resolve<CoursesRepository>('CoursesRepository')
        )
    },

    InscriptionsManager: {
        factory: (r) => r.resolve<InMemoryDatabaseDriver>('DatabaseDriver').connect('inscriptions')
    },
    InscriptionsRepository: {
        factory: (r) => new InscriptionsRepository(r.resolve<InMemoryDatabaseManager>('InscriptionsManager'))
    },
    InscriptionsService: {
        factory: (r) => new InscriptionsService(
            r.resolve<InMemoryDatabaseManager>('InscriptionsManager'),
            r.resolve<InscriptionsRepository>('InscriptionsRepository')
        )
    }
})

const studentsService = container.resolve<StudentsService>('StudentsService')
const coursesService = container.resolve<CoursesService>('CoursesService')
const inscriptionsService = container.resolve<InscriptionsService>('InscriptionsService')

const roster = new Roster(studentsService, logger)
const catalog = new Catalog(coursesService, logger)
const enrollment = new Enrollment(inscriptionsService, logger)

roster.create({ name: 'Alice', email: 'alice@example.com' })
roster.create({ name: 'Bob', email: 'bob@example.com' })

catalog.create({ name: 'TypeScript', description: 'Learn TypeScript', hours: 40 })
catalog.create({ name: 'Clean Architecture', description: 'Hexagonal patterns', hours: 20 })

const alice = new Student('Alice', Email.from('alice@example.com'))
const typescript = new Course('TypeScript', 'Learn TypeScript', 40)

enrollment.enroll(alice, typescript)

console.log('students:', roster.all())
console.log('courses:', catalog.all())
console.log('inscriptions:', enrollment.all())
```

#### Next Step

Use this structure as the default layout for new code. When you need to inspect
the purpose of a generated file, consult `generated-file-reference.md`.
