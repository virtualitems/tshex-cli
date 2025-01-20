// Libraries

// Shared Module

import Entity from '../../shared/domain/Entity.js';

// Other Modules

// Same Layer

// Lower Layers

// Types

// Constants


/**
 * @description A User is an access to interact with the system.
 */
export default class User extends Entity
{

    [property: string]: unknown;

    // public ATTRIBUTES

    // protected ATTRIBUTES

    protected _id: number;

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    constructor(id: number)
    {
        super();
        this._id = id;
    }

    public get id(): number
    {
        return this._id;
    }

    // public METHODS

    public equals(other: User): boolean
    {
        return this.id === other.id;
    }

    public flatten(): Record<string, unknown>
    {
        return { id: this.id };
    }

    // protected METHODS

    // private METHODS

    // public static METHODS

    // protected static METHODS

    // private static METHODS

} //:: class
