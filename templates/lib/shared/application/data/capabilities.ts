type Generic = Record<string, unknown>

type QueryResponse = Generic | Promise<Generic[]>

export interface Listable {
    all(): QueryResponse
}

/**
 * @description Declares a filtering operation over plain source records.
 */
export interface Filterable {
    filter(selector: unknown): QueryResponse
}

/**
 * @description Declares a sorting operation over plain source records.
 */
export interface Sortable {
    sort(selector: unknown): QueryResponse
}

/**
 * @description Declares a creation operation for plain source records.
 */
export interface Creatable {
    create(data: unknown): unknown
}

/**
 * @description Declares an update operation that selects source records and applies new plain data.
 */
export interface Updatable {
    update(selector: unknown, data: unknown): unknown
}

/**
 * @description Declares a deletion operation over source records selected by plain criteria.
 */
export interface Deletable {
    delete(selector: unknown): unknown
}

/**
 * @description Declares an aggregation operation over source records.
 */
export interface Aggregatable {
    aggregate(selector: unknown): unknown
}

/**
 * @description Declares operations for selecting or preloading relationships from a data source.
 */
export interface Relatable {
    selectRelated(...args: unknown[]): unknown

    prefetchRelated(...args: unknown[]): unknown
}
