// Libraries

// Same Layer

import ValueObject from './ValueObject.js';

import ValueError from '../errors/ValueError.js';

// Lower Layers

// Types

type T = boolean;

// Constants


/**
 * @description 
 */
export default class BooleanValueObject extends ValueObject
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

    public override equals(other: BooleanValueObject | null | undefined): boolean
    {
        if (other === null || other === undefined) {
            return false;
        }

        return this.value === other.value;
    }

    public toggle(): BooleanValueObject
    {
        return new BooleanValueObject(!this.value);
    }

    // protected METHODS

    // private METHODS

    // public static METHODS

    public static override isValid(value: unknown): boolean
    {
        return ('boolean' === typeof value);
    }

    public static from(value: T): BooleanValueObject
    {
        if (!this.isValid(value)) {
            throw new ValueError(value, this.name);
        }
        return new this(value);
    }

    // protected static METHODS

    // private static METHODS

} //:: class
