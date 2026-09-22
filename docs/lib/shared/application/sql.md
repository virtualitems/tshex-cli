### `lib/shared/application/sql.ts`

`SqlParamsBuilder` converts a plain record into the ordered SQL fragments and
bound values required by a query. It prepares parameters for `INSERT`,
`UPDATE`, and `WHERE` clauses. It does not execute SQL or create complete SQL
statements.

#### Current implementation

The following code is the current implementation of `SqlParamsBuilder` and its
parameter contracts.

```ts
export type SqlRecord = Record<string, null | string | number | boolean>

export interface SqlInsertParams {
    fields: string[]
    placeholders: string[]
    values: unknown[]
}

export interface SqlUpdateParams {
    placeholders: string[]
    values: unknown[]
}

export interface SqlWhereParams {
    placeholders: string[]
    values: unknown[]
}

export class SqlParamsBuilder {
    public constructor(
        private readonly placeholder: string = '?'
    ) {}

    public insert(data: SqlRecord): SqlInsertParams {
        const fields: string[] = []
        const placeholders: string[] = []
        const values: unknown[] = []

        for (const [field, value] of Object.entries(data)) {
            fields.push(field)
            values.push(value)
            placeholders.push(this.placeholder)
        }

        return { fields, placeholders, values }
    }

    public update(data: SqlRecord): SqlUpdateParams {
        const placeholders: string[] = []
        const values: unknown[] = []

        for (const [field, value] of Object.entries(data)) {
            values.push(value)

            placeholders.push(`${field} = ${this.placeholder}`)
        }

        return { placeholders, values }
    }

    public where(data: SqlRecord): SqlWhereParams {
        const placeholders: string[] = []
        const values: unknown[] = []

        for (const [field, value] of Object.entries(data)) {
            values.push(value)

            placeholders.push(`${field} = ${this.placeholder}`)
        }

        return { placeholders, values }
    }
}
```

#### Example

The following input produces the fragments required for an `INSERT` binding.

```ts
const data: SqlRecord = { email: 'ada@example.com' }
const sqlParamsBuilder = new SqlParamsBuilder()
const params = sqlParamsBuilder.insert(data)

// result: { fields: ['email'], placeholders: ['?'], values: ['ada@example.com'] }
// usage:  run(`INSERT INTO users (${params.fields.join(', ')}) VALUES (${params.placeholders.join(', ')})`, params.values)
```
