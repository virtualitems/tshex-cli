// Libraries

// Same Layer

import { ValueError } from './errors.ts'

// Lower Layers

// Types

// Constants

/**
 * @see https://emailregex.com/
 */
const VALID_EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

/**
 * @description
 */
export abstract class ValueObject<T = unknown> {
    [property: string]: unknown

    // public ATTRIBUTES

    public abstract readonly value: T

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    // public METHODS

    public abstract equals(other: ValueObject<T> | null | undefined): boolean

    // protected METHODS

    // private METHODS

    // public static METHODS

    public static isValid(value: unknown): boolean {
        return (
            value !== null &&
            value !== undefined &&
            Object.is(value, NaN) === false
        )
    }

    // protected static METHODS

    // private static METHODS
} //:: class

/**
 * @description
 */
export class NullableBoolean extends ValueObject<boolean | null> {
    [property: string]: unknown

    // public ATTRIBUTES

    public override readonly value: boolean | null

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    protected constructor(value: boolean | null) {
        super()
        this.value = value
    }

    // public METHODS

    public override equals(other: NullableBoolean | null | undefined): boolean {
        if (other === null || other === undefined) return false
        return this.value === other.value
    }

    public isIndeterminate(): boolean {
        return this.value === null
    }

    // protected METHODS

    // private METHODS

    // public static METHODS

    public static from(value: boolean | null): NullableBoolean {
        return new this(value)
    }

    // protected static METHODS

    // private static METHODS
} //:: class

/**
 * @description
 */
export class Email extends ValueObject<string> {
    [property: string]: unknown

    // public ATTRIBUTES

    public override readonly value: string

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    protected constructor(value: string) {
        super()
        this.value = value
    }

    get username(): string | undefined {
        return this.value.split('@').shift()
    }

    get domain(): string | undefined {
        return this.value.split('@').pop()
    }

    get tld(): string | undefined {
        return this.domain?.split('.').pop()
    }

    // public METHODS

    public override equals(other: Email | null | undefined): boolean {
        if (other === null || other === undefined) {
            return false
        }

        return this.value === other.value
    }

    // protected METHODS

    // private METHODS

    // public static METHODS

    public static override isValid(value: unknown): boolean {
        if (super.isValid(value) === false) return false

        return (
            'string' === typeof value && VALID_EMAIL_REGEX.test(value as string)
        )
    }

    public static from(value: string): Email {
        if (this.isValid(value) === false)
            throw new ValueError(value, this.name)

        return new this(value)
    }

    // protected static METHODS

    // private static METHODS
} //:: class
