// Libraries

// Same Layer

import ValueObject from './ValueObject.js';

import ValueError from '../errors/ValueError.js';

// Lower Layers

// Types

type T = number;

// Constants


/**
* @description 
*/
export default class NumericValueObject extends ValueObject
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

    public override equals(other: NumericValueObject | null | undefined): boolean
    {
        if (other === null || other === undefined) {
            return false;
        }

        return this.value === other.value;
    }

    public isInteger(): boolean
    {
        return Number.isInteger(this.value);
    }

    public isZero(): boolean
    {
        return this.value === 0;
    }

    public isPositive(): boolean
    {
        return this.value > 0;
    }

    public isNegative(): boolean
    {
        return this.value < 0;
    }

    public isOdd(): boolean
    {
        return (this.value & 1) === 1;
    }

    public isEven(): boolean
    {
        return (this.value & 1) === 0;
    }

    public isBetween(min: T, max: T, inclusiveMin = true, inclusiveMax = true): boolean
    {

        if (inclusiveMin && inclusiveMax) {
            return this.value >= min && this.value <= max;
        }

        if (inclusiveMin) {
            return this.value >= min && this.value < max;
        }

        if (inclusiveMax) {
            return this.value > min && this.value <= max;
        }

        return this.value > min && this.value < max;

    }

    // protected METHODS

    // private METHODS

    // public static METHODS

    public static override isValid(value: unknown): boolean
    {
        return (
            'number' === typeof value
            && !Object.is(value, NaN)
            && !Object.is(value, Infinity)
            && !Object.is(value, -Infinity)
        );
    }

    public static from(value: T): NumericValueObject
    {
        if (!this.isValid(value)) {
            throw new ValueError(value, this.name);
        }
        return new this(value);
    }

    // protected static METHODS

    // private static METHODS

} //:: class
