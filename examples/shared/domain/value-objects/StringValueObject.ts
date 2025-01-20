// Libraries

// Same Layer

import ValueObject from './ValueObject.js';

import ValueError from '../errors/ValueError.js';

// Lower Layers

// Types

type T = string;

// Constants


/**
* @description 
*/
export default class StringValueObject extends ValueObject
{

    [property: string]: unknown;

    // public ATTRIBUTES

    public override readonly value: T;

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    protected constructor(value: T)
    {
        super();
        this.value = value;
    }

    // public METHODS

    public override equals(other: StringValueObject | null | undefined): boolean
    {
        if (other === null || other === undefined) {
            return false;
        }

        return this.value === other.value;
    }

    public isEmpty(): boolean
    {
        return this.value === '';
    }

    // protected METHODS

    // private METHODS

    // public static METHODS

    public static override isValid(value: unknown): boolean
    {
        return ('string' === typeof value);
    }

    public static from(value: T): StringValueObject
    {
        if (!this.isValid(value)) {
            throw new ValueError(value, this.name);
        }
        return new this(value);
    }

    // protected static METHODS

    // private static METHODS

} //:: class
