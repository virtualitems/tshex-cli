/**
 * @description Abstract base for domain aggregates that group related entities under a consistency boundary.
 */
export abstract class Aggregate {
    [property: string]: unknown
} //:: class
