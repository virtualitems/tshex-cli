# Hexagonal Architecture CLI

This CLI will help you to generate a hexagonal architecture structure.

# Why?

Hexagonal architecture is a software design pattern that separates the internal domain of the application from the external dependencies. This separation is achieved by dividing the application into layers. Each layer has a specific responsibility and interacts with the other layers in a specific way.

The goal is to separate the domain code from installed dependencies. A Hexagonal Architecture _framework_ would work against that goal, since it couples the domain code to the framework itself. That is why this CLI exists: it scaffolds the structure for you, using your own codebase instead of a framework.

# Note

This tool and its templates are in constant development, so be aware that some changes may occur and be careful when updating the tool.

If you have any suggestions or improvements, please let me know.

https://github.com/virtualitems/tshex-cli/issues

# Getting started

`tshex` scaffolds folders and files for a hexagonal architecture project. It does not write business logic for you; it only generates the structure, so you can fill it in with your own code.

There are four things you can generate:

- A **library** (`--lib`): the shared foundation of a project. It contains the domain and application contracts (entities, value objects, services, etc.) that the rest of the code depends on.
- A **context** (`--ctx`): a specific business area (e.g. `users`, `billing`, `orders`). It contains the `domain/`, `application/`, and `adapters/` folders where you implement that area's logic.
- A **React context** (`--react-context`): a React-ready context scaffold.

A typical project has one library and one or more contexts inside it.

## Install

Install the CLI globally:

```bash
npm install -g tshex-cli
```

Check the installation:

```bash
tshex --version
```

Show the command options:

```bash
tshex --help
```

## Usage

```bash
tshex [--lib <name>] [--ctx <name>] [--react-context <name>] [--dir <path>]
```

| Option         | Purpose                                                            |
| -------------- | ------------------------------------------------------------------- |
| `--lib <name>` | Generate a library called `<name>`, based on `templates/lib`.       |
| `--ctx <name>` | Generate a context called `<name>`, based on `templates/ctx`.       |
| `--react-context <name>` | Generate a React context called `<name>`, based on `templates/react-context`. |
| `--dir <path>` | Parent directory where the library/context will be created. Defaults to the current directory. |
| `--help`       | Show the command options.                                           |
| `--version`    | Show the installed version.                                         |

`--lib`, `--ctx`, and `--react-context` can be used together in a single command. Running `tshex` without any options just prints the help text — it does not generate anything.

## Create a library

Use this when you are starting a new project and need the shared contracts that the rest of your code will build on:

```bash
tshex --lib core
```

This generates a `core/` folder in the current directory:

```text
core/
├── index.d.ts
├── main.ts
└── shared/
    ├── application/
    │   ├── databases.ts
    │   ├── events.ts
    │   ├── http.ts
    │   ├── loggers.ts
    │   └── services.ts
    └── domain/
        ├── aggregates.ts
        ├── entities.ts
        ├── errors.ts
        └── value-objects.ts
```

What each file is for:

| File               | Purpose                                       |
| ------------------ | --------------------------------------------- |
| `index.d.ts`       | Declare library types.                        |
| `main.ts`          | Export the library API.                       |
| `entities.ts`      | Define entity contracts.                      |
| `value-objects.ts` | Define value objects and validation.          |
| `aggregates.ts`    | Define aggregate contracts.                   |
| `errors.ts`        | Define domain errors.                         |
| `services.ts`      | Define application service contracts.         |
| `databases.ts`     | Define data manager and repository contracts. |
| `events.ts`        | Define event contracts.                       |
| `http.ts`          | Define HTTP response contracts.               |
| `loggers.ts`       | Define logger contracts.                      |

`main.ts` is generated with a placeholder `throw new Error('Not implemented yet')`, so the library fails loudly if you try to use it before filling it in. To start using it, open `main.ts`, remove that line, and export your own code, built on top of the shared contracts. For example:

```ts
export { Entity } from './shared/domain/entities.js'
export { ValueObject, Email } from './shared/domain/value-objects.js'

class User extends Entity {
    constructor(public readonly email: Email) {
        super()
    }
}
```

## Create a context

Use this to scaffold a specific business area, such as `users`, inside an existing library (or on its own):

```bash
tshex --ctx users
```

This generates a `users/` folder in the current directory:

```text
users/
├── adapters/
├── application/
├── domain/
└── index.ts
```

What each part is for:

| Path           | Purpose                                                         |
| -------------- | ---------------------------------------------------------------- |
| `domain/`      | Entities, value objects, aggregates, and domain errors.          |
| `application/` | Use cases, services, DTOs, and contracts.                        |
| `adapters/`    | Database, HTTP, event, file, and service implementations.        |
| `index.ts`     | Export or compose the context's public API.                      |

## Choose the destination folder

By default, `tshex` creates files in your current directory. Use `--dir` to choose a different parent directory instead.

Create a library inside `./src`:

```bash
tshex --lib core --dir ./src
```

This generates the library at:

```text
./src/core
```

Create a context inside that library:

```bash
tshex --ctx users --dir ./src/core
```

This generates the context at:

```text
./src/core/users
```

You can also use an absolute path:

```bash
tshex --ctx users --dir /workspace/project/src
```

## Create a library and a context together

You can generate both in a single command. `tshex` creates the library first, then creates the context inside it:

```bash
tshex --dir ./src --lib core --ctx users
```

Result:

```text
src/
└── core/
    ├── index.d.ts
    ├── main.ts
    ├── shared/
    └── users/
        ├── adapters/
        ├── application/
        ├── domain/
        └── index.ts
```

    ## Create a React context

    Use this when you want only the React context scaffold:

    ```bash
    tshex --react-context users
    ```

    This generates a `users/` folder in the current directory.
