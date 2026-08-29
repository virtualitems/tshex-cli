/**
 * @description Operates on a data source using plain objects and arrays.
 * It exposes the raw data without transforming it.
 */
export abstract class DataManager<T = Record<string, unknown>> {
    [property: string]: unknown
} //:: class

/**
 * @description Extends a data manager with set operations over data collections.
 */
export abstract class DatasetManager<T = Record<string, unknown>> extends DataManager<T> {
    [property: string]: unknown

    public abstract union(other: Array<T>): Array<T>

    public abstract intersection(other: Array<T>): Array<T>

    public abstract difference(other: Array<T>): Array<T>

    public abstract symmetricDifference(other: Array<T>): Array<T>

    public abstract complement(other: Array<T>): Array<T>
} //:: class
