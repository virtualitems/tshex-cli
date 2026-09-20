import type { Identifiable } from '../../domain/entities.ts'

/**
 * @description Parameters for a SQL INSERT statement produced by the builder.
 */
export interface SqlInsertParams {
    readonly fields: string[]
    readonly placeholders: string[]
    readonly values: unknown[]
}

/**
 * @description Parameters for a SQL UPDATE statement produced by the builder.
 */
export interface SqlUpdateParams {
    readonly placeholders: string[]
    readonly values: unknown[]
}

/**
 * @description Parameters for a SQL WHERE clause produced by the builder.
 */
export interface SqlWhereParams {
    readonly placeholders: string[]
    readonly values: unknown[]
}

type SqlRecord = Record<string, unknown>

/**
 * @description Sort field and direction descriptor for a SQL ORDER BY clause.
 */
export interface Sortable {
    field: string
    direction: 'asc' | 'desc'
}

/**
 * @description Contract for data managers that can run arbitrary SQL mutation statements.
 */
export interface Executable<ResultShape extends unknown = boolean> {
    execute(sql: string, params?: unknown[]): ResultShape
}

/**
 * @description Contract for data managers that can run arbitrary SQL query statements.
 */
export interface Queryable<ResultShape extends unknown = null> {
    query(sql: string, params?: unknown[]): ResultShape
}

/**
 * @description Abstract base for all persistence data managers.
 */
export abstract class DataManager {
    [property: string]: unknown
} //:: class

/**
 * @description Abstract data manager that provides SQL parameter builder helpers for subclasses.
 */
export abstract class SqlDataManager extends DataManager {
    [property: string]: unknown

    /**
     * @description Builds INSERT parameters (fields, placeholders, values) from a plain record.
     */
    protected buildInsertParams(
        data: SqlRecord
    ): SqlInsertParams {
        const fields: string[] = []
        const placeholders: string[] = []
        const values: unknown[] = []

        for (const [field, value] of Object.entries(data)) {
            fields.push(field)
            placeholders.push('?')
            values.push(value)
        }

        return {
            fields,
            placeholders,
            values
        }
    }

    /**
     * @description Builds UPDATE parameters (placeholders, values) from a plain record, appending the target id as the last value.
     */
    protected buildUpdateParams<T extends string | number>(
        data: SqlRecord,
        target: Identifiable<T>
    ): SqlUpdateParams {
        const placeholders: string[] = []
        const values: unknown[] = []

        for (const [field, value] of Object.entries(data)) {
            if (field === 'id') {
                continue
            }

            placeholders.push(`${field} = ?`)
            values.push(value)
        }

        values.push(target.id)

        return { placeholders, values }
    }

    /**
     * @description Builds WHERE parameters (placeholders, values) from a plain record of conditions.
     */
    protected buildWhereParams(data: SqlRecord): SqlWhereParams {
        const placeholders: string[] = []
        const values: unknown[] = []

        for (const [field, value] of Object.entries(data)) {
            placeholders.push(`${field} = ?`)
            values.push(value)
        }

        return { placeholders, values }
    }
} //:: class

/**
 * @description Abstract data manager for set-oriented operations over a typed in-memory dataset.
 */
export abstract class DatasetManager<DataShape = Record<string, unknown>>
    extends DataManager {
    [property: string]: unknown

    public abstract union(other: Array<DataShape>): Array<DataShape>

    public abstract intersection(other: Array<DataShape>): Array<DataShape>

    public abstract difference(other: Array<DataShape>): Array<DataShape>

    public abstract symmetricDifference(other: Array<DataShape>): Array<DataShape>

    public abstract complement(other: Array<DataShape>): Array<DataShape>
} //:: class
