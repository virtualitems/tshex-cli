// Libraries

// Same Layer

// Lower Layers

// Types

// Constants

/**
 * @description
 */
export class HttpResponseBody {
    [property: string]: unknown

    // public ATTRIBUTES

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    public constructor(
        public readonly data: Record<string, unknown> | null = null,
        public readonly errors: string[] | null = null,
        public readonly links: Record<string, URL> | null = null
    ) {}

    // public METHODS

    // protected METHODS

    // private METHODS

    // public static METHODS

    // protected static METHODS

    // private static METHODS
} //:: class
