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

/**
 * @description Builds parameterized SQL fragments from plain records.
 */
export class SqlParamsBuilder {
    public constructor(
        private readonly placeholder: string = '?'
    ) {}

    /**
     * @description Builds INSERT parameters from a plain record.
     */
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

    /**
     * @description Builds UPDATE parameters from a plain record.
     */
    public update(data: SqlRecord): SqlUpdateParams {
        const placeholders: string[] = []
        const values: unknown[] = []

        for (const [field, value] of Object.entries(data)) {
            values.push(value)

            placeholders.push(`${field} = ${this.placeholder}`)
        }

        return { placeholders, values }
    }

    /**
     * @description Builds WHERE parameters from a plain record of conditions.
     */
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
