/**
 * @description Contract for entities that expose a unique typed identifier.
 */
export interface Identifiable<T extends unknown = number> {
    readonly id: T
} //:: Identifiable

/**
 * @description Contract for entities that expose a unique typed slug.
 */
export interface Slugable<T extends unknown = string> {
    readonly slug: T
} //:: Slugable

/**
 * @description Abstract base for domain entities that enforce structural equality.
 */
export abstract class Entity {
    [property: string]: unknown

    /**
     * @description Returns true when this entity and the other represent the same domain object.
     */
    public abstract equals(other: Entity): boolean

    /**
     * @description Returns the entity fields as a plain object for JSON serialization.
     */
    public toJSON(): Record<string, unknown> {
        return this
    }

    /**
     * @description Returns the class name as the string representation of the entity.
     */
    public toString(): string {
        return this.constructor.name
    }
} //:: Entity
