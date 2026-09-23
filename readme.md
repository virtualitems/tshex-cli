# Hexagonal Architecture CLI `tshex-cli`

`tshex-cli` creates the base structure of a project organized by contexts. The structure groups shared contracts, domain concepts, use cases, and adapters into directories with defined responsibilities.

In this guide, we will build a project named `core` with a context named `users`. The walkthrough starts with the CLI and then explains the purpose of the generated components.

The examples in this guide are intentionally simple. They are designed to show the responsibility of each component, not to cover real infrastructure or production scenarios.

## Why?

Hexagonal architecture is a software design pattern that separates the core domain of the application from the external dependencies. This separation is achieved by dividing the application into layers. Each layer has a specific responsibility and interacts with the other layers in a specific way.

The goal is to separate the domain code from installed dependencies. A Hexagonal Architecture framework would work against that goal, since it couples the domain code to the framework itself. That is why this CLI exists: it scaffolds the structure for you, generating a codebase you own and control, instead of a framework.

## Getting started

### Installation

Install the package in a project:

```bash
npm install tshex-cli
```

Or install the executable globally:

```bash
npm install -g tshex-cli
```

View the available options with:

```bash
npx tshex --help
```

## Create a project

Create a project directory with the shared and type contexts:

```bash
npx tshex -P core
```

The project template creates this structure:

```text
core/
|-- main.ts
|-- shared/
|   |-- application/
|   `-- domain/
`-- types/
```

`main.ts` is an entry-point placeholder. `shared` contains reusable concepts
and mechanisms. `types` contains reusable TypeScript declarations.

## Create a context

A context groups the rules and operations of an application capability. `users`, `sales`, `billing`, and `inventory` are examples of contexts.

Create a context in the current directory:

```bash
npx tshex -C users
```

Create a project and its first context in one command:

```bash
npx tshex -P core -C users
```

The context becomes a sibling of `shared` and `types`:

```text
core/
|-- shared/
|-- types/
`-- users/
    |-- adapters/
    |-- application/
    |-- domain/
    `-- example.ts
```

`example.ts` is the generated root port placeholder. Replace or remove it.

Use `--dir` to choose the destination directory:

```bash
npx tshex --dir ./src -P core -C users
```

The command creates the project at `src/core`.

## Create a React context

Create a React context with `--react` and `--context`:

```bash
npx tshex -C users --react
```

A React context is a consumer by nature. It does not provide a hexagonal capability to other systems. Instead, it consumes existing capabilities and organizes that consumption as a collection of adapters for the UI layer.

```text
users/
|-- assets/
|-- components/
|-- hooks/
|-- languages/
|   |-- en.json
|   `-- es.json
|-- schemas/
`-- styles/
```

This layout is intentionally different from the default context template. The standard context separates `domain`, `application`, and `adapters` because it models and provides a capability. The React context generated with `--react` assumes the opposite role: it always consumes capabilities and groups the code around the adapters required by that consumption.

## Create tests

Create a test structure that mirrors the TypeScript files in an existing source
directory:

```bash
npx tshex -T ./core
```

This command helps you prepare a tests workspace that follows the shape of your source directory while fitting naturally into the place where you are working. You can use it in the current directory for a quick setup, or combine it with `--dir` when you want the tests structure to be created somewhere else. If `tests/` already contains content, the command continues working with what is already there instead of interrupting your flow.

Use `--dir` to place that directory elsewhere:

```bash
npx tshex -T ./core --dir ./output
```

## Documentation

From this point on, the guide is split into dedicated documents under `docs/`.
The `docs/lib/`, `docs/ctx/`, `docs/ctx-react/`, and `docs/tests/` directories
mirror the generated template paths. Each template file has a Markdown document
at the corresponding path.

### General

- [Library contexts](docs/lib/readme.md)
- [Context ports](docs/ctx/ports.md)
- [Generated file reference](docs/generated-file-reference.md)

### Shared types

- [JSON types](docs/lib/types/json.md)
- [Locale types](docs/lib/types/locales.md)
- [Object types](docs/lib/types/objects.md)
- [Time-zone types](docs/lib/types/timezones.md)

### Shared domain

- [Aggregates](docs/lib/shared/domain/aggregates.md)
- [Entities](docs/lib/shared/domain/entities.md)
- [Value objects](docs/lib/shared/domain/value-objects.md)

### Shared application

- [Environment adapter](docs/lib/shared/application/adapters/env.md)
- [Data drivers](docs/lib/shared/application/data/drivers.md)
- [Data managers](docs/lib/shared/application/data/managers.md)
- [Repositories](docs/lib/shared/application/data/repositories.md)
- [Events](docs/lib/shared/application/events.md)
- [HTTP errors](docs/lib/shared/application/http/errors.md)
- [Loggers](docs/lib/shared/application/loggers.md)
- [Providers](docs/lib/shared/application/providers.md)
- [Regular expressions](docs/lib/shared/application/regex.md)
- [Services](docs/lib/shared/application/services.md)
- [SQL parameters](docs/lib/shared/application/sql.md)
- [Validations](docs/lib/shared/application/validations.md)

### React context directories

- [Assets](docs/ctx-react/assets.md)
- [Components](docs/ctx-react/components.md)
- [Hooks](docs/ctx-react/hooks.md)
- [Languages](docs/ctx-react/languages.md)
- [Schemas](docs/ctx-react/schemas.md)
- [Styles](docs/ctx-react/styles.md)

### Tests

- [Test content](docs/tests/content.md)
