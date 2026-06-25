// Libraries

// Same Layer

// Lower Layers

// Types

// Constants

/**
 * @description
 */
export abstract class Event {
    [property: string]: unknown

    // public ATTRIBUTES

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    public constructor(
        public readonly timestamp: number = Date.now(),
        public readonly details: Record<string, unknown> = {}
    ) {}

    // public METHODS

    // protected METHODS

    // private METHODS

    // public static METHODS

    // protected static METHODS

    // private static METHODS
} //:: class

/**
 * @description
 */
export abstract class EventHandler {
    [property: string]: unknown

    // public ATTRIBUTES

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    // public METHODS

    public abstract handle(event: Event): Promise<void>

    // protected METHODS

    // private METHODS

    // public static METHODS

    // protected static METHODS

    // private static METHODS
} //:: class

/**
 * @description
 */
export abstract class EventDispatcher {
    [property: string]: unknown

    // public ATTRIBUTES

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    // public METHODS

    public abstract subscribe(key: unknown, handler: EventHandler): void

    public abstract unsubscribe(key: unknown, handler: EventHandler): void

    public abstract dispatch(event: Event): void

    // protected METHODS

    // private METHODS

    // public static METHODS

    // protected static METHODS

    // private static METHODS
} //:: class
