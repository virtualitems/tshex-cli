/**
 * @description An Entity is a class that represents a domain concept or element.
 */
export abstract class Entity {
    [property: string]: unknown

    public abstract equals(other: Entity): boolean

    public abstract toJSON(): Record<string, unknown>
} //:: class
