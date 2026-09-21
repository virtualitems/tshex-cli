### `lib/shared/application/sql.ts`

`SqlParamsBuilder` derives parameterized SQL fragments from a plain record. It
returns fields, placeholders, and values for inserts, updates, and where
conditions.

#### Build an INSERT binding

```ts
const params = new SqlParamsBuilder().insert({ email: 'ada@example.com' })

params
// { fields: ['email'], placeholders: ['?'], values: ['ada@example.com'] }
```

The default placeholder is `?`, and the constructor accepts another literal
token. The builder neither executes SQL nor quotes table and field names.
Drivers that require incrementing placeholder numbers need a compatible builder
or a transformation step.
