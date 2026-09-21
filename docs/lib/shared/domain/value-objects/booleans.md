### `lib/shared/domain/value-objects/booleans.ts`

`NullableBoolean` models a domain state that can be `true`, `false`, or
indeterminate.

#### Indeterminate states

```ts
const consent = NullableBoolean.from(null)

consent.isIndeterminate()
// true
```

`from()` accepts only a Boolean or `null`. It does not coerce string or numeric
input, so adapters must parse those representations before construction.
