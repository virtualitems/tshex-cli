// Libraries

// Same Layer

import ValueObject from './ValueObject.js';

import ValueError from '../errors/ValueError.js';

// Lower Layers

// Types

type T = Date;

// Constants


/**
* @description 
*/
export default class DateValueObject extends ValueObject
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

    public override equals(other: DateValueObject | null | undefined): boolean
    {
        if (other === null || other === undefined) {
            return false;
        }

        return this.value.getTime() === other.value.getTime();
    }

    public isAfter(other: DateValueObject): boolean
    {
        return this.value > other.value;
    }

    public isBefore(other: DateValueObject): boolean
    {
        return this.value < other.value;
    }

    // protected METHODS

    // private METHODS

    // public static METHODS

    public static override isValid(value: unknown): boolean
    {
        if (value === null || value === undefined) {
            return false;
        }

        if (!(value instanceof Date)) {
            return false;
        }

        return !isNaN(value.getTime());
    }

    public static from(value: T): DateValueObject
    {
        if (!this.isValid(value)) {
            throw new ValueError(value, this.name);
        }
        return new this(value);
    }

    // protected static METHODS

    // private static METHODS

} //:: class
