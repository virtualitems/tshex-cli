// Libraries

// Same Layer

// Lower Layers

// Types

// Constants

/**
 * @description
 */
export default abstract class ValueObject {
    [property: string]: unknown

    // public ATTRIBUTES

    public abstract readonly value: unknown

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    // public METHODS

    public abstract equals(other: ValueObject | null | undefined): boolean

    // protected METHODS

    // private METHODS

    // public static METHODS

    public static isValid(value: unknown): boolean {
        return value !== null && value !== undefined && Object.is(value, NaN) === false
    }

    // protected static METHODS

    // private static METHODS
} //:: class
