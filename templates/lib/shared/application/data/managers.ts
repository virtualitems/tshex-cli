/**
 * @description Operates on a data source using plain objects and arrays.
 * It exposes the raw data without transforming it.
 */
export abstract class DataManager {
    [property: string]: unknown
} //:: class

/**
 * @description Extends a data manager with set operations over data collections.
 */
export abstract class DatasetManager<T = Record<string, unknown>> extends DataManager {
    [property: string]: unknown

    public abstract union(other: Array<T>): Promise<Array<T>>

    public abstract intersection(other: Array<T>): Promise<Array<T>>

    public abstract difference(other: Array<T>): Promise<Array<T>>

    public abstract symmetricDifference(other: Array<T>): Promise<Array<T>>

    public abstract complement(other: Array<T>): Promise<Array<T>>
} //:: class
