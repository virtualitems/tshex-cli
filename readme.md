# Hexagonal Architecture CLI `tshex-cli`

`tshex-cli` creates the base structure of a project organized by contexts. The structure groups shared contracts, domain concepts, use cases, and adapters into directories with defined responsibilities.

In this guide, we will build a project named `core` with a context named `users`. The walkthrough starts with the CLI and then explains the purpose of the generated components.

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

### Create a project

The `--project` option receives the name of the project's root directory:

```bash
npx tshex --project core
```

You can also use the short form:

```bash
npx tshex -P core
```

In this example, `core` will contain the shared code, the contexts, and the project's main implementation.

### Create a context

The `--context` option receives the context name:

```bash
npx tshex --context users
```

You can also use the short form:

```bash
npx tshex -C users
```

A context groups the rules and operations of an application capability. `users`, `sales`, `billing`, and `inventory` are examples of contexts.

### Create the project and the first context

You can generate both components in a single execution:

```bash
npx tshex --project core --context users
```

The command creates this structure:

```text
core/
|-- main.ts
|-- shared/
|   |-- application/
|   |   |-- data/
|   |   |   |-- drivers.ts
|   |   |   |-- managers.ts
|   |   |   `-- repositories.ts
|   |   |-- events.ts
|   |   |-- http/
|   |   |   |-- errors.ts
|   |   |   |-- handlers.ts
|   |   |   |-- json-api.ts
|   |   |   |-- json-web-token.ts
|   |   |   `-- opengraph.ts
|   |   |-- loggers.ts
|   |   |-- services.ts
|   |   `-- validations.ts
|   `-- domain/
|       |-- aggregates.ts
|       |-- entities.ts
|       |-- errors.ts
|       `-- value-objects.ts
|-- types/
|   |-- json.d.ts
|   |-- locales.d.ts
|   |-- objects.d.ts
|   `-- timezones.d.ts
`-- users/
    |-- adapters/
    |-- application/
    |-- domain/
    `-- example-ports.ts
```

### Choose the destination directory

The `--dir` option specifies the directory from which the structure is created:

```bash
npx tshex --dir ./src --project core --context users
```

The example project is created at `src/core`.

To add a context to an existing project, use the project as the destination directory:

```bash
npx tshex --dir ./core --context billing
```

The context is created at `core/billing`.

### Create a context for React

The `--react` option creates a context intended for a React application.

A React context is a consumer by nature. It does not provide a hexagonal capability to other systems. Instead, it consumes existing capabilities and organizes that consumption as a collection of adapters for the UI layer.

Use this mode when the generated context will call APIs, validate interface data, expose hooks, compose components, and localize messages.

```bash
npx tshex --context users --react
```

You can also use its short form:

```bash
npx tshex -C users -R
```

The command creates this structure:

```text
users/
|-- api/
|-- assets/
|-- components/
|-- core/
|-- hooks/
|-- languages/
`-- schemas/
```

Each directory represents a consumption adapter or a resource used by those adapters:

| Directory | Responsibility |
| --- | --- |
| `api/` | Adapters that call external services or backend contexts. |
| `assets/` | Static resources used by the React context. |
| `components/` | Visual react adapters that render the consumed capability. |
| `core/` | Local support code and project modules adapters shared by the adapters in this context. |
| `hooks/` | React hook adapters that expose behavior to components. |
| `languages/` | Translation resources for the interface. Can be json, ts files, etc. |
| `schemas/` | Validation and parsing adapters for UI input and output. |

This layout is intentionally different from the default context template. The standard context separates `domain`, `application`, and `adapters` because it models and provides a capability. The React context generated with `--react` assumes the opposite role: it always consumes capabilities and groups the code around the adapters required by that consumption.

### Create a tests structure

The `--tests` option receives a source directory and creates a matching tests structure.

```bash
npx tshex --tests ./core
```

You can also use the short form:

```bash
npx tshex -T ./core
```

The command creates the output inside a `tests/` directory. If `tests/` does not exist, the CLI asks whether it should be created.

By default, the `tests/` directory is resolved from the current execution directory:

```bash
npx tshex -T ./core
```

This generates a structure like this:

```text
tests/
`-- core/
    |-- users/
    |   |-- adapters/
    |   |-- application/
    |   |   `-- create-user.ts
    |   `-- domain/
    `-- billing/
        |-- application/
        `-- domain/
```

To choose another base directory for `tests/`, combine `--tests` with `--dir`:

```bash
npx tshex -T ./core --dir ./output
```

That command creates or reuses `./output/tests/`.

This command helps you prepare a tests workspace that follows the shape of your source directory while fitting naturally into the place where you are working. You can use it in the current directory for a quick setup, or combine it with `--dir` when you want the tests structure to be created somewhere else. If `tests/` already contains content, the command continues working with what is already there instead of interrupting your flow.

## Documentation index

From this point on, the guide is split into dedicated documents under `docs/`.

### General

- [Project structure](https://github.com/virtualitems/tshex-cli/blob/main/docs/library-structure.md)
- [Context ports](https://github.com/virtualitems/tshex-cli/blob/main/docs/context-ports.md)
- [Generated file reference](https://github.com/virtualitems/tshex-cli/blob/main/docs/generated-file-reference.md)

### Types

- [types/objects.d.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/types/objects.md)
- [types/json.d.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/types/json.md)
- [types/locales.d.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/types/locales.md)
- [types/timezones.d.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/types/timezones.md)

### Shared application

- [shared/application/data](https://github.com/virtualitems/tshex-cli/blob/main/docs/shared/application/data.md)
- [shared/application/events.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/shared/application/events.md)
- [shared/application/http/errors.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/shared/application/http/errors.md)
- [shared/application/http/handlers.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/shared/application/http/handlers.md)
- [shared/application/http/json-api.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/shared/application/http/json-api.md)
- [shared/application/http/json-web-token.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/shared/application/http/json-web-token.md)
- [shared/application/http/opengraph.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/shared/application/http/opengraph.md)
- [shared/application/loggers.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/shared/application/loggers.md)
- [shared/application/services.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/shared/application/services.md)
- [shared/application/validations.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/shared/application/validations.md)

### Shared domain

- [shared/domain/aggregates.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/shared/domain/aggregates.md)
- [shared/domain/entities.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/shared/domain/entities.md)
- [shared/domain/errors.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/shared/domain/errors.md)
- [shared/domain/value-objects.ts](https://github.com/virtualitems/tshex-cli/blob/main/docs/shared/domain/value-objects.md)
