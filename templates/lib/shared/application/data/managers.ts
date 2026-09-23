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
