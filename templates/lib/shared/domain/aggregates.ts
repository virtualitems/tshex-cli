/**
 * @description An Aggregate is a class that contains business logic that doesn't belong to any entity.
 * It is used to perform operations that don't fit into an entity or involve multiple entities.
 * Normally, method arguments are entities.
 */
export abstract class Aggregate {
    [property: string]: unknown
} //:: class
