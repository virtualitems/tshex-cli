### Library Structure

`tshex --project core` copies the library template into `core/`. The template
contains a root placeholder, shared contracts, root type declarations, and no
application contexts until the command receives `--context`.

```text
core/
|-- main.ts
|-- shared/
|   |-- application/
|   |   |-- adapters/env.ts
|   |   |-- data/
|   |   |   |-- drivers.ts
|   |   |   |-- managers.ts
|   |   |   `-- repositories.ts
|   |   |-- events.ts
|   |   |-- http/errors.ts
|   |   |-- loggers.ts
|   |   |-- providers.ts
|   |   |-- regex.ts
|   |   |-- services.ts
|   |   |-- sql.ts
|   |   `-- validations.ts
|   `-- domain/
|       |-- aggregates.ts
|       |-- entities.ts
|       `-- value-objects/
|           |-- booleans.ts
|           |-- errors.ts
|           |-- strings.ts
|           `-- values.ts
`-- types/
    |-- json.d.ts
    |-- locales.d.ts
    |-- objects.d.ts
    `-- timezones.d.ts
```

`main.ts` throws until the project replaces it. `types/` contains ambient types
used across the library. `shared/domain/` contains reusable domain bases.
`shared/application/` contains reusable application contracts and helpers.

`tshex --project core --context users` adds the context beside the shared
directory.

```text
core/users/
|-- adapters/
|-- application/
|-- domain/
`-- example.ts
```

The context template does not generate concrete adapters, services, or domain
models. `example.ts` is a placeholder boundary module that can be replaced or
deleted when the context exposes its first capability.

#### Dependency Direction

The template does not enforce imports, but its directory roles support one
dependency direction:

```text
context adapter -> context application -> context domain
                                  |
                                  -> shared application and shared domain
```

Use the domain directory for domain rules. Use the application directory for
operations that coordinate those rules and external collaborators. Use adapters
for transport and infrastructure code. Move code to `shared/` only when more
than one context uses the same contract or domain concept.

The generated-file reference lists every template file and its responsibility.
