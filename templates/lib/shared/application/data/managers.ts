/**
 * @description
 */
export interface Filterable<S = Record<string, unknown>> {
    filter(selector: S): Promise<Array<S>>
}

/**
 * @description
 */
export interface Sortable<S = Record<string, unknown>> {
    sort(selector: S): Promise<Array<S>>
}

/**
 * @description
 */
export interface Creatable<D = Record<string, unknown>> {
    create(data: D): Promise<unknown>
}

/**
 * @description
 */
export interface Updatable<S = Record<string, unknown>, D = Record<string, unknown>> {
    update(selector: S, data: D): Promise<unknown>
}

/**
 * @description
 */
export interface Deletable<S = Record<string, unknown>> {
    delete(selector: S): Promise<unknown>
}

/**
 * @description
 */
export interface Aggregatable<S = Record<string, unknown>> {
    aggregate(selector: S): Promise<S>
}

/**
 * @description
 */
export interface Relatable {
    selectRelated(...args: unknown[]): unknown

    prefetchRelated(...args: unknown[]): unknown
}

/**
 * @description
 */
export abstract class DataManager<T = Record<string, unknown>> {
    [property: string]: unknown

    public abstract all(): Promise<Array<T>>

    public abstract none(): Array<T>
} //:: class

/**
 * @description
 */
export abstract class DatasetManager<T = Record<string, unknown>> extends DataManager<T> {
    [property: string]: unknown

    public abstract union(other: Array<T>): Promise<Array<T>>

    public abstract intersection(other: Array<T>): Promise<Array<T>>

    public abstract difference(other: Array<T>): Promise<Array<T>>

    public abstract symmetricDifference(other: Array<T>): Promise<Array<T>>

    public abstract complement(other: Array<T>): Promise<Array<T>>
} //:: class
