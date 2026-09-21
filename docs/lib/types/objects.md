### `lib/types/objects.d.ts`

`objects.d.ts` declares `Generic<T>`, a string-keyed record whose values have
type `T`.

#### Generic maps

Use `Generic<User>` when a function accepts an object with arbitrary string
keys and `User` values.

```ts
const users: Generic<{ id: number }> = { primary: { id: 204 } }
```

#### Known key sets

`Generic<T>` does not require named keys and does not validate values at
runtime. Use an interface or a specific object type when the key set is known.
