// Libraries

// Same Layer

// Lower Layers

// Types

// Constants


/**
* @description 
*/
export default class ValueError extends Error
{

    [property: string]: unknown;

    // public ATTRIBUTES

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    public constructor(value: unknown, expected: string)
    {
        let valueRepr: string;

        if (value === undefined) {
            valueRepr = 'undefined';
        }

        else if (value === null) {
            valueRepr = 'null';
        }

        else if (Object.is(value, NaN)) {
            valueRepr = 'NaN';
        }

        else {
            valueRepr = `${value.constructor.name}(${value.toString()})`;
        }

        super(`Invalid value ${valueRepr} for ${expected}.`);
    }

    // public METHODS

    // protected METHODS

    // private METHODS

    // public static METHODS

    // protected static METHODS

    // private static METHODS

} //:: class
