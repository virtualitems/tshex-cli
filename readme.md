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
npx tshex --project core
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

Create a context in the current directory:

```bash
npx tshex --context users
```

Create a project and its first context in one command:

```bash
npx tshex --project core --context users
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
npx tshex --dir ./src --project core --context users
```

The command creates the project at `src/core`.

## Create a React context

Create a React context with `--react` and `--context`:

```bash
npx tshex --context users --react
```

A React context consumes capabilities for a user interface. It organizes the
modules that render the interface, expose interface behavior, define data
contracts, localize text, and provide static resources.

```text
users/
|-- api/
|-- assets/
|-- components/
|-- hooks/
|-- languages/
|   |-- en.json
|   `-- es.json
|-- schemas/
`-- styles/
```

## Create tests

Create a test structure that mirrors the TypeScript files in an existing source
directory:

```bash
npx tshex --tests ./core
```

The command creates or reuses a `tests/` directory in the current directory.
Use `--dir` to place that directory elsewhere:

```bash
npx tshex --tests ./core --dir ./output
```

## Documentation

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
