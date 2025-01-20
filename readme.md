# Hexagonal Architecture CLI

This CLI will help you to generate a hexagonal architecture structure.

# Why?

Hexagonal architecture is a software design pattern that separates the internal domain of the application from the external dependencies.. This separation is achieved by dividing the application into layers. Each layer has a specific responsibility and interacts with the other layers in a specific way.

Because what we are trying to achieve is a separation between the domain code and the installed dependencies, a Hexagonal Architecture Framework is a step in the opposite direction, as it couples the domain code with the framework. This is why we need a tool to help us to create the structure with our own codebase.

# Usage example

https://github.com/virtualitems/tshex-cli

# Note!!!

This tool and its templates are in constant development, so be aware that some changes may occur and be careful when updating the tool.

If you have any suggestions or improvements, please let me know.

https://github.com/virtualitems/tshex-cli/issues

# Installation

```bash
npm install -g tshex-cli
```

# Usage

> Remember to replace placeholders `<...>` with the actual data.
>

## Getting started

```bash
tshex --lib <library-name> --ctx <context-name>
```

## Help

```bash
tshex -h

tshex --help
```

## Create a new library

```bash
tshex --lib <name>
```

## Create a new context

```bash
tshex --ctx <name>
```

## Create a new class

```bash
tshex --cls <name>
```

## Create a new react functional component

```bash
tshex --rfc <name>
```

## Set the directory to create the new items

```bash
tshex --lib <lib-name> --ctx <ctx-name> --dir <path>
```