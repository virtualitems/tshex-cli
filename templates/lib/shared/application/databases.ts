// Libraries

// Same Layer

// Lower Layers

// Types

// Constants

/**
 * @description
 */
export abstract class DataManager {
    [property: string]: unknown

    // Public Attributes

    // Protected Attributes

    // Private Attributes

    // Public Static Attributes

    // Protected Static Attributes

    // Private Static Attributes

    // Constructor, Getters, Setters

    // Public Methods

    public abstract connect(...args: unknown[]): Promise<unknown>

    public abstract disconnect(): Promise<unknown>

    // Protected Methods

    // Private Methods

    // Public Static Methods

    // Protected Static Methods

    // Private Static Methods
} //:: class

/**
 * @description Represents a data source.
 */
export abstract class Repository<Manager extends DataManager> {
    [property: string]: unknown

    // Public Attributes

    // Protected Attributes

    // Private Attributes

    // Public Static Attributes

    // Protected Static Attributes

    // Private Static Attributes

    // Constructor, Getters, Setters

    public constructor(public readonly manager: Manager) {}

    // Public Methods

    // Protected Methods

    // Private Methods

    // Public Static Methods

    // Protected Static Methods

    // Private Static Methods
} //:: class
