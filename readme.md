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

## Documentation index

From this point on, the guide is split into dedicated documents under `docs/`.

### General

- [Library structure](./docs/library-structure.md)
- [Library types](./docs/library-types.md)
- [Context ports](./docs/context-ports.md)
- [Generated file reference](./docs/generated-file-reference.md)

### Shared application

- [shared/application/data](./docs/shared/application/data.md)
- [shared/application/events.ts](./docs/shared/application/events.md)
- [shared/application/http.ts](./docs/shared/application/http.md)
- [shared/application/loggers.ts](./docs/shared/application/loggers.md)
- [shared/application/services.ts](./docs/shared/application/services.md)
- [shared/application/validations.ts](./docs/shared/application/validations.md)

### Shared domain

- [shared/domain/aggregates.ts](./docs/shared/domain/aggregates.md)
- [shared/domain/entities.ts](./docs/shared/domain/entities.md)
- [shared/domain/errors.ts](./docs/shared/domain/errors.md)
- [shared/domain/value-objects.ts](./docs/shared/domain/value-objects.md)
