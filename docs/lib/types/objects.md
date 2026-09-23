### `lib/types/objects.d.ts`

This module provides general object types for application code. The types
describe object shapes at compile time and do not validate values at runtime.

#### Current implementation

The following code is the current module implementation.

```ts
export type Generic<T = unknown> = Record<string, T>
```

#### Example

Use `Generic<T>` when a function accepts an object with arbitrary string keys
and values of one type.

```ts
const users: Generic<{ id: number }> = { primary: { id: 204 } }
```

Use an interface or a specific object type when the key set is known.
