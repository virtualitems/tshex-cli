### `lib/types/json.d.ts`

This module provides recursive types for values that follow the JSON data
model. Use the types in application boundaries that accept or return JSON
shapes. The module does not serialize or parse data.

#### Current implementation

The following code is the current module implementation.

```ts
export type JsonPrimitive = string | number | boolean | null

export type JsonValue = JsonPrimitive | JsonObject | JsonArray

export type JsonArray = readonly JsonValue[]

export type JsonObject = {
    readonly [key: string]: JsonValue
}
```

#### Example

Use `JsonValue` for data that must fit the JSON value model.

```ts
const payload: JsonValue = { user: { id: 204, active: true } }
```
