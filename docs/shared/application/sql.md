### SQL Parameters

`SqlParamsBuilder` turns a plain record into the fields, placeholders, and
values required to assemble parameterized SQL. It does not execute SQL and it
does not quote identifiers.

```ts title="shared/application/sql.ts"
import { SqlParamsBuilder } from './shared/application/sql.ts'

const builder = new SqlParamsBuilder()
const params = builder.insert({ email: 'ada@example.com', active: true })

const statement = `INSERT INTO users (${params.fields.join(', ')}) VALUES (${params.placeholders.join(', ')})`
```

The `insert()` call produces the following result:

```ts
{
    fields: ['email', 'active'],
    placeholders: ['?', '?'],
    values: ['ada@example.com', true]
}
```

Pass `statement` and `params.values` to the database driver. The fields and
values follow the order of `Object.entries(data)`, so they remain aligned for
the same record.

`update()` and `where()` produce `field = placeholder` fragments and values in
the same order.

```ts
builder.update({ active: false })
// { placeholders: ['active = ?'], values: [false] }

builder.where({ email: 'ada@example.com' })
// { placeholders: ['email = ?'], values: ['ada@example.com'] }
```

Pass a different placeholder token when the target driver requires one.

```ts
const postgresBuilder = new SqlParamsBuilder('$1')
postgresBuilder.where({ id: 204 })
// { placeholders: ['id = $1'], values: [204] }
```

The builder repeats the configured placeholder for every field. Drivers that
require numbered placeholders must provide a compatible builder or transform
the generated fragments.
