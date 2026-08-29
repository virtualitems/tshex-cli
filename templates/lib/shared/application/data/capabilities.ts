type Generic = Record<string, unknown>

export interface Listable<DataShape extends Generic = Generic> {
    all(): DataShape[]
}

/**
 * @description Declares a filtering operation over plain source records.
 */
export interface Filterable<DataShape extends Generic = Generic, Selector = unknown> {
    filter(selector: Selector): DataShape[]
}

/**
 * @description Declares a sorting operation over plain source records.
 */
export interface Sortable<DataShape extends Generic = Generic, Selector = unknown> {
    sort(selector: Selector): DataShape[]
}

/**
 * @description Declares a creation operation for plain source records.
 */
export interface Creatable<DataShape extends Generic = Generic, Feedback = unknown> {
    create(data: DataShape): Feedback
}

/**
 * @description Declares an update operation that selects source records and applies new plain data.
 */
export interface Updatable<
    DataShape extends Generic = Generic,
    Selector = unknown,
    Feedback = unknown
> {
    update(selector: Selector, data: Partial<DataShape>): Feedback
}

/**
 * @description Declares a deletion operation over source records selected by plain criteria.
 */
export interface Deletable<Selector = unknown, Feedback = unknown> {
    delete(selector: Selector): Feedback
}

/**
 * @description Declares an aggregation operation over source records.
 */
export interface Aggregatable<Selector = unknown, Feedback = unknown> {
    aggregate(selector: Selector): Feedback
}

/**
 * @description Declares operations for selecting or preloading relationships from a data source.
 */
export interface Relatable {
    selectRelated(...args: unknown[]): unknown

    prefetchRelated(...args: unknown[]): unknown
}
