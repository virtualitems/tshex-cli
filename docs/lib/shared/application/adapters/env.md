### `lib/shared/application/adapters/env.ts`

This module isolates environment-specific configuration from application code.
It exposes a project-owned map that an adapter can populate and includes local
helpers for validating and converting configured values.

The module belongs to `adapters` so that its implementation can import a
library that loads environment variables. Other application modules consume
the configuration exports without depending on that library.

#### Current implementation

The following code is the current module implementation.

```ts
export const env: Record<string, string> = {}

function required(env: Record<string, string>, key: string): string {
    if (Object.hasOwn(env, key) === false) {
        throw new Error(`Environment variable "${key}" is required`)
    }

    const trimmed = env[key].trim()

    if (trimmed === '') {
        throw new Error(`Environment variable "${key}" cannot be empty`)
    }

    return trimmed
}

function asInteger(env: Record<string, string>, key: string): number {
    if (Object.hasOwn(env, key) === false) {
        throw new Error(`Environment variable "${key}" is required`)
    }

    const trimmed = env[key].trim()

    if (trimmed === '') {
        throw new Error(`Environment variable "${key}" cannot be empty`)
    }

    const transformed = Number(trimmed)

    if (Number.isInteger(transformed) === false) {
        throw new Error(`Environment variable "${key}" must be an integer`)
    }

    return transformed
}

function asFloat(env: Record<string, string>, key: string): number {
    if (Object.hasOwn(env, key) === false) {
        throw new Error(`Environment variable "${key}" is required`)
    }

    const trimmed = env[key].trim()

    if (trimmed === '') {
        throw new Error(`Environment variable "${key}" cannot be empty`)
    }

    const transformed = Number(trimmed)

    if (Number.isFinite(transformed) === false) {
        throw new Error(`Environment variable "${key}" must be a float`)
    }

    return transformed
}

function asBoolean(env: Record<string, string>, key: string, truthy: string[], falsy: string[]): boolean {
    if (Object.hasOwn(env, key) === false) {
        throw new Error(`Environment variable "${key}" is required`)
    }

    const trimmed = env[key].trim()

    if (trimmed === '') {
        throw new Error(`Environment variable "${key}" cannot be empty`)
    }

    if (truthy.includes(trimmed)) {
        return true
    }

    if (falsy.includes(trimmed)) {
        return false
    }

    throw new Error(`Environment variable "${key}" must be a defined boolean value`)
}
```

#### Example

The helper functions are internal to this module. The environment adapter uses
them when it declares configuration exports, which validates and converts the
string values in the map before other modules consume them.

```ts
// env.ts

export const VERSION = required(env, 'VERSION')

export const PORT = asInteger(env, 'PORT')
```

```ts
import { VERSION, PORT } from './env.ts'

console.log(`Version: ${VERSION}`)
console.log(`Port: ${PORT}`)
```
