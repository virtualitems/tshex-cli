### `lib/shared/application/regex.ts`

`regex.ts` exports `ID_PATTERN` for decimal identifiers and `UUID_PATTERN` for
UUID versions one through five.

#### Validate complete identifiers

```ts
ID_PATTERN.test('204')
// true

UUID_PATTERN.test('550e8400-e29b-41d4-a716-446655440000')
// true
```

Both expressions match the full input because they use start and end anchors.
They validate a string shape only; they do not perform database lookups or
convert a matching value to another type.
