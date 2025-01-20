// Libraries

// Shared Module

import EmailValueObject from '../../shared/domain/value-objects/EmailValueObject.js';
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

    protected _id: number | null;
    protected _email: EmailValueObject | null;

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    constructor(id: number | null = null)
    {
        super();
        this._id = id;
        this._email = null;
    }

    public get id(): number | null
    {
        return this._id;
    }

    public get email(): string | null
    {
        return (this._email === null ? null : this._email.value);
    }

    public set email(value: string | null)
    {
        if (value === null) {
            this._email = null;
            return;
        }
        this._email = EmailValueObject.from(value);
    }

    // public METHODS

    public equals(other: User): boolean
    {
        return this.id === other.id;
    }

    public flatten(): Record<string, unknown>
    {
        return {
            id: this.id,
            email: this.email
        };
    }

    // protected METHODS

    // private METHODS

    // public static METHODS

    // protected static METHODS

    // private static METHODS

} //:: class
