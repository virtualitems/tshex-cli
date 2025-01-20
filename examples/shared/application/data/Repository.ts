// Libraries

// Same Layer

import type DataManager from './DataManager.js';

// Lower Layers

// Types

// Constants


/**
* @description Represents a data source.
*/
export default abstract class Repository<M extends DataManager>
{

    [property: string]: unknown;

    // Public Attributes

    public manager: M;

    // Protected Attributes

    // Private Attributes

    // Public Static Attributes

    // Protected Static Attributes

    // Private Static Attributes

    // Constructor, Getters, Setters

    public constructor(manager: M)
    {
        this.manager = manager;
    }

    // Public Methods

    // Protected Methods

    // Private Methods

    // Public Static Methods

    // Protected Static Methods

    // Private Static Methods

} //:: class
