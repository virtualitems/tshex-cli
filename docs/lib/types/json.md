### `lib/types/json.d.ts`

`json.d.ts` declares recursive TypeScript types for JSON primitives, arrays,
objects, and values.

#### JSON-shaped values

Use `JsonValue` for data that must fit the JSON value model.

```ts
const payload: JsonValue = { user: { id: 204, active: true } }
```

#### Values outside JSON

`JsonValue` excludes `undefined`, functions, symbols, bigint values, and
class instances. The type does not serialize or parse data.
