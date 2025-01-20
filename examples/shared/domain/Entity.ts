// Libraries

// Same Layer

// Lower Layers

// Types

// Constants


/**
 * @description An Entity is a class that represents a domain concept or element.
 */
export default abstract class Entity
{

    [property: string]: unknown;

    // public ATTRIBUTES

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    // public METHODS

    public abstract equals(other: Entity): boolean;

    public abstract flatten(): Record<string, unknown>;

    // protected METHODS

    // private METHODS

    // public static METHODS

    // protected static METHODS

    // private static METHODS

} //:: class
