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

```text
index.d.ts
main.ts
shared/
users/
```

`index.d.ts` defines root-level types. `main.ts` starts as a placeholder for
main runtime exports. The rest of the structure lives under `shared/` and one
or more context directories.

#### Shared

The `shared` directory contains concepts that can be reused by multiple
contexts.

```text
shared/
├── application/
└── domain/
```

`shared/domain` contains modeling foundations such as value objects, entities,
aggregates, and errors. `shared/application` contains contracts for services,
validations, events, logging, HTTP boundaries, and data access.

Move code to `shared` only when its meaning belongs to more than one context.
Until then, keep it close to the context that owns the rule.

#### Contexts

A context groups the vocabulary, rules, and operations of one application
capability.

```text
users/
billing/
inventory/
sales/
```

Each context can evolve independently while still reusing the abstractions from
`shared`. This separation reduces accidental coupling between unrelated parts of
the system.

#### Context Layout

Every generated context starts with the same internal structure.

```text
users/
├── example-ports.ts
├── adapters/
├── application/
└── domain/
```

`example-ports.ts` is the root communication surface of the context.
`domain/` contains capabilities and rules. `application/` contains processes.
`adapters/` contains boundary implementations.

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

An adapter can expose an HTTP handler, consume a message, call a remote API,
implement a data driver, or connect to an event bus. Its role is to translate
external input or output into the contracts expected by the application layer.

#### Ports

Ports define the communication available at the context boundary.

They live at the context root because they describe how the context is used
from the outside. An adapter imports a port, implements it, and delegates the
work to an application process.

The generated template starts with `example-ports.ts`, but a larger context may
split ports across several files. The detailed guidance for that layout lives in
`context-ports.md`.

#### Dependency Direction

The normal dependency direction is the following:

```text
adapter -> port
adapter -> application
application -> domain
```

This direction keeps the core model isolated from transport and infrastructure
details. The deeper a layer is, the less it should know about the outside.

> **Warning**
> Avoid importing adapter-specific concerns into the domain layer. Once a domain
> object depends on HTTP, database, or framework details, the context boundary
> becomes harder to change.

#### Example Flow

The following diagram shows the runtime flow of a typical operation.

```text
External system
      |
      v
Port + adapter
      |
      v
Application service
      |
      v
Domain capability
```

The adapter receives the input, the application service coordinates the use
case, and the domain provides the rules and behavior required by that use case.

#### Next Step

Use this structure as the default layout for new code. When you need to inspect
the purpose of a generated file, consult `generated-file-reference.md`.