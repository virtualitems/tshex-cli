### JSON

The generated root also declares a small family of types that describe plain,
serializable JSON data.
They are used when a contract must guarantee that a value survives a round
trip through `JSON.stringify()` / `JSON.parse()`.

#### Declaration

These types live in `types/json.d.ts`.

```ts title="types/json.d.ts"
export type JsonPrimitive = string | number | boolean | null

export type JsonValue = JsonPrimitive | JsonObject | JsonArray

export type JsonArray = readonly JsonValue[]

export type JsonObject = {
    readonly [key: string]: JsonValue
}
```

`JsonPrimitive` covers the scalar values allowed in JSON. `JsonValue` extends
that with nested objects and arrays, so it recursively describes any JSON-safe
value. `JsonObject` and `JsonArray` name the two composite shapes so other
declarations can refer to them directly instead of repeating the union.

#### Implementation Options

A `JsonValue` is always one of four shapes. Each one is a distinct option a
consumer must be ready to handle.

| Shape | Type | Example |
| --- | --- | --- |
| Primitive | `JsonPrimitive` | `'active'`, `42`, `true`, `null` |
| Object | `JsonObject` | `{ id: '1', active: true }` |
| Array | `JsonArray` | `[1, 2, 3]`, `[{ id: '1' }]` |
| Nested composite | `JsonValue` | `{ tags: ['a', 'b'], meta: { retries: 2 } }` |

```ts
import { type JsonValue } from './types/json.js'

const primitive: JsonValue = 'ada@example.com'
const object: JsonValue = { id: '1', active: true }
const array: JsonValue = [1, 2, 3]
const nested: JsonValue = { tags: ['a', 'b'], meta: { retries: 2 } }
```

All four are valid `JsonValue` values because the type is a recursive union;
there is no separate constructor or runtime check to opt into a shape.

#### Basic Usage

```ts
import { type JsonValue } from './types/json.js'

function toLogPayload(value: JsonValue): string {
    return JSON.stringify(value)
}
```

Because `JsonValue` excludes functions, `undefined`, symbols, and other
non-serializable values, `toLogPayload()` can call `JSON.stringify()` without
guarding against values that would silently disappear or throw.

#### JsonObject Versus Generic

Use `JsonObject`/`JsonValue` when a contract must guarantee its data is plain
and serializable, such as request payloads, stored metadata, or wire formats.
Prefer `types/objects.md`'s `Generic<T>` instead when the value type is not
required to be JSON-safe.

`shared/application/http/json-api.ts` and
`shared/application/http/json-web-token.ts` build on these types to describe
JSON:API documents and JOSE/JWT structures; see `shared/application/http/json-api.md`
and `shared/application/http/json-web-token.md`.

> **Hint**
> These declarations only provide compile-time structure. They do not validate
> that a runtime value is actually JSON-safe; a value typed as `JsonValue` can
> still contain a `Date` or a class instance if it was cast into the type.
