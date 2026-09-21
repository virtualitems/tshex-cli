### Generated File Reference

This reference describes the files copied by `tshex --project <name>`. It
identifies the generated surface only; it does not prescribe an implementation
for a context or an adapter.

The `docs/lib/`, `docs/ctx/`, `docs/ctx-react/`, and `docs/tests/` directories
mirror the template paths. Each generated template file has a Markdown page at
the corresponding documentation path with a `.md` extension. The documents
outside those directories provide additional architectural guidance.

#### Root Files

The root contains the main entry points of the generated library.

| File | Responsibility |
| --- | --- |
| `main.ts` | Starts as a placeholder for the main implementation and root exports. |

`main.ts` throws `Not implemented yet`. Replace it with the library entry point
and root exports that the project needs.

#### Types Files

The `types/` directory contains root-level ambient type declarations.

| File | Responsibility |
| --- | --- |
| `types/objects.d.ts` | Declares root-level shared types such as `Generic<T>`. |
| `types/json.d.ts` | Declares `JsonValue` and the other plain, serializable JSON shapes. |
| `types/locales.d.ts` | Declares the `Locale` union from Unicode CLDR. |
| `types/timezones.d.ts` | Declares the `TimeZone` union from the IANA time zone database. |

`types/objects.d.ts` and `types/json.d.ts` are the place for general-purpose
root-level type declarations. `types/locales.d.ts` and `types/timezones.d.ts`
are generated reference types consumed by other shared contracts, such as
`shared/application/loggers.ts`. Each file is documented in its own page under
`types/*.md`.

#### Shared Domain Files

The `shared/domain` directory contains foundations for domain modeling.

| File | Responsibility |
| --- | --- |
| `shared/domain/value-objects/values.ts` | Declares the `ValueObject<T>` base class. |
| `shared/domain/value-objects/strings.ts` | Declares the `Email` value object. |
| `shared/domain/value-objects/booleans.ts` | Declares the `NullableBoolean` value object. |
| `shared/domain/value-objects/errors.ts` | Declares `ValueError`. |
| `shared/domain/entities.ts` | Declares the `Entity` base class. |
| `shared/domain/aggregates.ts` | Declares the `Aggregate` base class. |

These files contain reusable domain concepts whose meaning can be shared across
contexts. They are discussed in more detail in `shared/domain/*.md`.

#### Shared Application Files

The `shared/application` directory contains contracts used to coordinate use
cases and integrations.

| File | Responsibility |
| --- | --- |
| `shared/application/validations.ts` | Declares the `Validatable` contract. |
| `shared/application/services.ts` | Declares the `Service` base class for use cases. |
| `shared/application/loggers.ts` | Declares shared log levels, the `Loggable` interface, and the `Logger` contract. |
| `shared/application/events.ts` | Declares `Event`, `EventHandler`, and `EventDispatcher`. |
| `shared/application/providers.ts` | Declares synchronous and asynchronous dependency injection containers. |
| `shared/application/regex.ts` | Exports `ID_PATTERN` and `UUID_PATTERN`. |
| `shared/application/sql.ts` | Exports `SqlParamsBuilder` and its result types. |
| `shared/application/adapters/env.ts` | Exports the initial `env` record for an environment adapter. |

These files do not implement frameworks or transports. They define the stable
contracts that adapters and services can share.

#### Shared HTTP Files

The `shared/application/http` directory groups the framework-agnostic HTTP
boundary contracts.

| File | Responsibility |
| --- | --- |
| `shared/application/http/errors.ts` | Declares `HttpError`. |

`errors.ts` is documented in its own page under `shared/application/http/errors.md`.

#### Shared Data Files

The generated template also includes a small set of data-access abstractions.

| File | Responsibility |
| --- | --- |
| `shared/application/data/drivers.ts` | Declares `SessionManager` and `DriverManager` for asynchronous persistence sessions. |
| `shared/application/data/managers.ts` | Declares `DataManager`, `SqlDataManager`, `DatasetManager`, and SQL operation contracts. |
| `shared/application/data/repositories.ts` | Declares `Repository` and repository operation contracts. |

These contracts belong to the application layer because they define how the
application coordinates data access without forcing a specific driver.

#### Context Files

Each generated context starts with an example port module and three directories.

| Path | Responsibility |
| --- | --- |
| `<context>/example.ts` | Placeholder boundary module that exports `Example`. Replace or remove it when the context has a real boundary API. |
| `<context>/domain/` | Domain capabilities and rules for the context. Domain code is execution-context agnostic and runs unchanged across backend, browser, and mobile environments. |
| `<context>/application/` | Processes that use domain capabilities to fulfill system purposes. This layer carries the execution context and may include logic specific to backend, browser, or mobile environments. |
| `<context>/adapters/` | Integrations that wrap third-party libraries. Adapters are instantiated in port modules. |

The `<context>/` path is a placeholder for the actual context name. Your
project can generate one or more contexts with the same internal layout.

In a course enrollment system the contexts might be `students/`, `courses/`,
and `enrollment/`, each with this same structure.

#### React Context Files

`tshex --context <name> --react` creates a different template for a context
that consumes capabilities in a React application.

| Path | Responsibility |
| --- | --- |
| `<context>/api/` | API adapters. |
| `<context>/assets/` | Static interface assets. |
| `<context>/components/` | React components. |
| `<context>/core/` | Local shared support code. |
| `<context>/hooks/` | React hooks. |
| `<context>/languages/en.json` | Initial English translation resource. |
| `<context>/languages/es.json` | Initial Spanish translation resource. |
| `<context>/schemas/` | Input and output schemas. |

#### How To Use This Reference

Use the following sequence when deciding where new code belongs.

1. Put reusable domain concepts in `shared/domain`.
2. Put reusable application contracts in `shared/application`.
3. Put context-specific rules in `<context>/domain`.
4. Put use cases in `<context>/application`.
5. Put transport and infrastructure integrations in `<context>/adapters`.
6. Instantiate adapters and expose boundary capabilities in context root `.ts` files.

This reference explains placement. The architectural rationale is described in
`library-structure.md`.
