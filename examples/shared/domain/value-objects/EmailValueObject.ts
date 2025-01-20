// Libraries

// Same Layer

import StringValueObject from './StringValueObject.js';

import ValueError from '../errors/ValueError.js';

// Lower Layers

// Types

type T = string;

// Constants


/**
* @description 
*/
export default class EmailValueObject extends StringValueObject
{

    [property: string]: unknown;

    // public ATTRIBUTES

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    get username(): string | undefined
    {
        return this.value.split('@').shift();
    }

    get domain(): string | undefined
    {
        return this.value.split('@').pop();
    }

    get tld(): string | undefined
    {
        return this.domain?.split('.').pop();
    }

    // public METHODS

    // protected METHODS

    // private METHODS

    // public static METHODS

    /**
    * @see https://emailregex.com/
    */
    public static override isValid(value: unknown): boolean
    {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!super.isValid(value)) {
            return false;
        }

        return regex.test(value as string);
    }

    public static override from(value: T): EmailValueObject
    {
        if (!this.isValid(value)) {
            throw new ValueError(value, this.name);
        }
        return new this(value);
    }

    // protected static METHODS

    // private static METHODS

} //:: class
