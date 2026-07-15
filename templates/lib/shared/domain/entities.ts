/**
 * @description Represents a domain concept with its own identity.
 * Two instances describe the same element when they share that identity.
 */
export abstract class Entity {
    [property: string]: unknown

    public abstract equals(other: Entity): boolean

    public toJSON(): Record<string, unknown> {
        return this
    }

    public toString(): string {
        return String(this.constructor.name)
    }
} //:: class
