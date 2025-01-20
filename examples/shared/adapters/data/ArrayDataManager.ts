// Libraries

// Same Layer

// Lower Layers

import DataManager from '../../application/data/DataManager.js';

// Types

// Constants


/**
* @description 
*/
export default class ArrayDataManager<T extends Record<string, unknown>> extends DataManager
{

    [property: string | symbol]: unknown;

    // Public Attributes

    // Protected Attributes

    protected _connection: T[] | null;

    protected _database: T[];

    // Private Attributes

    // Public Static Attributes

    // Protected Static Attributes

    // Private Static Attributes

    // Constructor, Getters, Setters

    constructor(database: T[])
    {
        super();
        this._database = database;
        this._connection = null;
    }

    // Public Methods

    public override async connect(): Promise<void>
    {
        this._connection = this._database;  // Set the connection
    }

    public override async disconnect(): Promise<void>
    {
        this._connection = null;  // Clear the connection
    }

    // Protected Methods

    // Private Methods

    // Public Static Methods

    // Protected Static Methods

    // Private Static Methods

} //:: class
