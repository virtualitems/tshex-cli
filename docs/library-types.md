### Library Types

The generated root type `Generic<T>` represents a plain object whose keys are
strings and whose values share the same type.
It provides a small common building block for code that works with object-like
data but does not need a more specific shape yet.

#### Root Declaration

The root declaration lives in `types/objects.d.ts`.

```ts title="types/objects.d.ts"
export type Generic<T = unknown> = Record<string, T>
```

This alias expands to `Record<string, T>`. When no type argument is provided,
the values use `unknown`.

#### Basic Usage

In the following example we use `Generic<string>` for a set of plain filters.

```ts
import { type Generic } from './types/objects.js'

const filters: Generic<string> = {
    status: 'active',
    sort: 'email',
}
```

`filters` can only store string values because the type argument fixes the
value shape for the whole object.

#### Default Type Argument

Now consider the same pattern without providing a type argument.

```ts
import { type Generic } from './types/objects.js'

const metadata: Generic = {
    retries: 2,
    cached: true,
}
```

In this case the values use `unknown`. This is useful when the object is plain
and open-ended, but the caller must narrow each value before using it in a
specific way.

#### When To Use It

Use `Generic<T>` when the code needs a simple object contract and the exact set
of keys is not the main concern.

Typical uses include:

1. filter objects;
2. metadata objects;
3. plain configuration maps;
4. transport-neutral dictionaries.

When the object has a stable business meaning, prefer a named type instead of a
generic record.

> **Hint**
> `Generic<T>` is intentionally small. It should support loose object contracts,
> not replace explicit domain or application types.

#### JSON Values

The generated root also declares a small family of types that describe plain,
serializable JSON data. They live in `types/json.d.ts`.

```ts title="types/json.d.ts"
export type JsonPrimitive = string | number | boolean | null

export type JsonValue = JsonPrimitive | JsonObject | JsonArray

export type JsonArray = readonly JsonValue[]

export type JsonObject = {
    readonly [key: string]: JsonValue
}
```

`JsonPrimitive` covers the scalar values allowed in JSON. `JsonValue` extends
that with nested objects and arrays, so it recursively describes any value that
survives a round trip through `JSON.stringify()`/`JSON.parse()`. `JsonObject`
and `JsonArray` name the two composite shapes so other declarations can refer
to them directly instead of repeating the union.

```ts
import { type JsonValue } from './types/json.js'

function toLogPayload(value: JsonValue): string {
    return JSON.stringify(value)
}
```

Use `JsonValue` and `JsonObject` when a contract must guarantee its data is
plain and serializable, such as request payloads, stored metadata, or wire
formats. Prefer `Generic<T>` instead when the value type is not required to be
JSON-safe. `shared/application/http/json-api.ts` and
`shared/application/http/json-web-token.ts` build on these types to describe
JSON:API documents and JOSE/JWT structures.

#### Next Step

For the rest of the generated shared abstractions, continue with the pages in
`shared/application` and `shared/domain`.