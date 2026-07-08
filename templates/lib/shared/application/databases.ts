type Generic<T = unknown> = Record<string, T>

/**
 * @description
 */
export interface Filterable<S = Generic> {
    filter(selector: S): Promise<Array<S>>
}

/**
 * @description
 */
export interface Sortable<S = Generic> {
    sort(selector: S): Promise<Array<S>>
}

/**
 * @description
 */
export interface Creatable<D = Generic> {
    create(data: D): Promise<unknown>
}

/**
 * @description
 */
export interface Updatable<S = Generic, D = Generic> {
    update(selector: S, data: D): Promise<unknown>
}

/**
 * @description
 */
export interface Deletable<S = Generic> {
    delete(selector: S): Promise<unknown>
}

/**
 * @description
 */
export interface Aggregatable<S = Generic> {
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
export abstract class DataManager<T = Generic> {
    [property: string]: unknown

    public abstract all(): Promise<Array<T>>

    public abstract none(): Array<T>
} //:: class

/**
 * @description
 */
export abstract class DatasetManager<T = Generic> extends DataManager<T> {
    [property: string]: unknown

    public abstract union(other: Array<T>): Promise<Array<T>>

    public abstract intersection(other: Array<T>): Promise<Array<T>>

    public abstract difference(other: Array<T>): Promise<Array<T>>

    public abstract symmetric_difference(other: Array<T>): Promise<Array<T>>

    public abstract complement(other: Array<T>): Promise<Array<T>>
} //:: class

/**
 * @description
 */
export abstract class DriverManager<M extends DataManager = DataManager> {
    [property: string]: unknown

    public abstract connect(...args: unknown[]): Promise<M>

    public abstract disconnect(): Promise<unknown>
} //:: class

/**
 * @description Represents a data source.
 */
export abstract class Repository<M extends DriverManager = DriverManager> {
    [property: string]: unknown

    public constructor(public readonly manager: M) {}

    protected abstract transform<T = Generic>(data: Generic): T
} //:: class
