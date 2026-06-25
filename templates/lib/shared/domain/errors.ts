// Libraries

// Same Layer

// Lower Layers

// Types

// Constants

/**
 * @description
 */
export class ValueError extends Error {
    [property: string]: unknown

    // public ATTRIBUTES

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    public constructor(received: string, expected: string) {
        super(`Invalid value ${received} for ${expected}.`)
    }

    // public METHODS

    // protected METHODS

    // private METHODS

    // public static METHODS

    // protected static METHODS

    // private static METHODS
} //:: class
