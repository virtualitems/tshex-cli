### Project contexts

The project directory organizes code into contexts. A context is a directory
that groups the modules for one capability or shared concern. It owns the
vocabulary, types, and operations required for that concern, and it includes
only the layers it needs. Creating a project adds the `shared` and `types`
contexts. Creating a context adds another context directory beside them.

```
project/
  shared/
    domain/
    application/
      adapters/
  types/
  students/
```

`shared` is the context for capabilities that every other context may use. It
contains common domain concepts, application mechanisms, and technology
adapters that do not belong to one business capability. Shared code must not
depend on a specific context. Put a rule or type that belongs only to one
business capability in that capability's context instead.

`types` is also a context. It provides reusable TypeScript declarations, such
as JSON, locale, time-zone, and generic object types. It has no domain or
application behavior because its responsibility is limited to type contracts.

The project template also creates `main.ts` as an entry-point placeholder.
Creating a context adds a sibling directory with `domain`, `application`, and
`adapters` directories, plus `example.ts` at the context root. Replace or
remove `example.ts` when the context exposes its first port.

#### Domain

The domain layer defines the concepts and behavior of the context. It contains
entities, aggregates, value objects, and domain rules. The domain layer does
not depend on application workflows, adapters, or external technologies.

#### Application

The application layer coordinates the use cases of the context. It invokes
domain behavior, defines application services, and organizes the operations
that work with data or other dependencies. It depends on the domain layer and
does not contain the domain rules that the domain layer owns.

#### Adapters

The adapter layer connects the context to external libraries, runtime
configuration, data sources, or other systems. An adapter implements a
technology-specific concern and receives its configuration during context
bootstrap. Application services receive adapters as dependencies, which keeps
the application and domain layers independent of a particular technology.

Provide an adapter's configuration when the context constructs the adapter,
preferably through its constructor. This keeps configuration out of the
adapter implementation and allows the same adapter type to operate with
different configuration values.

#### Allowed imports and dependency direction

A root port module exposes a context capability and composes the context during
bootstrap. It creates configured adapters and passes them to application
services. Only a port module may import `env.ts`.

Port modules may import only application and adapter modules. Adapter modules
may import only other port modules or third-party libraries. Application
modules may import only domain and application modules.
Domain modules may import only domain modules.
