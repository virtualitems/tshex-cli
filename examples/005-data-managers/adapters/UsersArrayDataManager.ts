// Libraries

// Shared Module

import ArrayDataManager from '../../shared/adapters/data/ArrayDataManager.js';

// Other Modules

// Same Layer

// Lower Layers

import IUsersDataManager from '../application/IUsersDataManager.js';

// Types

// Constants


/**
* @description 
*/
export default
    class
    UsersArrayDataManager
    extends
    ArrayDataManager<Record<string, unknown>>
    implements
    IUsersDataManager
{

    [property: string | symbol]: unknown;

    // public ATTRIBUTES

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    // public METHODS

    public async all(): Promise<Array<Record<string, unknown>>>
    {

        if (!this._connection) {
            throw new Error('Database not connected.');
        }

        return Array.from(this._connection);
    }

    public async store(data: Record<string, unknown>): Promise<void>
    {

        if (!this._connection) {
            throw new Error('Database not connected.');
        }

        this._connection.push(data);

    }

    // protected METHODS

    // private METHODS

    // public static METHODS

    // protected static METHODS

    // private static METHODS

} //:: class
