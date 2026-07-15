/**
 * @description Declares a filtering operation over plain source records.
 */
export interface Filterable<S = Record<string, unknown>> {
    filter(selector: S): Promise<Array<S>>
}

/**
 * @description Declares a sorting operation over plain source records.
 */
export interface Sortable<S = Record<string, unknown>> {
    sort(selector: S): Promise<Array<S>>
}

/**
 * @description Declares a creation operation for plain source records.
 */
export interface Creatable<D = Record<string, unknown>> {
    create(data: D): Promise<unknown>
}

/**
 * @description Declares an update operation that selects source records and applies new plain data.
 */
export interface Updatable<S = Record<string, unknown>, D = Record<string, unknown>> {
    update(selector: S, data: D): Promise<unknown>
}

/**
 * @description Declares a deletion operation over source records selected by plain criteria.
 */
export interface Deletable<S = Record<string, unknown>> {
    delete(selector: S): Promise<unknown>
}

/**
 * @description Declares an aggregation operation over source records.
 */
export interface Aggregatable<S = Record<string, unknown>> {
    aggregate(selector: S): Promise<S>
}

/**
 * @description Declares operations for selecting or preloading relationships from a data source.
 */
export interface Relatable {
    selectRelated(...args: unknown[]): unknown

    prefetchRelated(...args: unknown[]): unknown
}

/**
 * @description Operates on a data source using plain objects and arrays.
 * It exposes the raw data without transforming it.
 */
export abstract class DataManager<T = Record<string, unknown>> {
    [property: string]: unknown

    public none(): Array<T> {
        return []
    }

    public abstract all(): Promise<Array<T>>
} //:: class

/**
 * @description Extends a data manager with set operations over data collections.
 */
export abstract class DatasetManager<T = Record<string, unknown>> extends DataManager<T> {
    [property: string]: unknown

    public abstract union(other: Array<T>): Promise<Array<T>>

    public abstract intersection(other: Array<T>): Promise<Array<T>>

    public abstract difference(other: Array<T>): Promise<Array<T>>

    public abstract symmetricDifference(other: Array<T>): Promise<Array<T>>

    public abstract complement(other: Array<T>): Promise<Array<T>>
} //:: class
