import { ValueError } from './errors.js'

/**
 * @see https://emailregex.com/
 */
const VALID_EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

/**
 * @description Represents a domain concept whose identity is determined by its value.
 * It centralizes the rules, semantics, and behavior that belong to that value.
 */
export abstract class ValueObject<T = unknown> {
    [property: string]: unknown

    public abstract readonly value: T

    public toString(): string {
        return String(this.value)
    }

    public toJSON(): T {
        return this.value
    }

    public abstract equals(other: ValueObject<T> | null | undefined): boolean

    public static isValid(value: unknown): boolean {
        return (
            value !== null &&
            value !== undefined &&
            Object.is(value, NaN) === false
        )
    }
} //:: class

/**
 * @description Models a Boolean state that can be true, false, or null.
 * It adds explicit behavior for the indeterminate state.
 */
export class NullableBoolean extends ValueObject<boolean | null> {
    [property: string]: unknown

    public override readonly value: boolean | null

    protected constructor(value: boolean | null) {
        super()
        this.value = value
    }

    public override equals(other: NullableBoolean | null | undefined): boolean {
        if (other === null || other === undefined) return false
        return this.value === other.value
    }

    public isIndeterminate(): boolean {
        return this.value === null
    }

    public static from(value: boolean | null): NullableBoolean {
        return new this(value)
    }
} //:: class

/**
 * @description Represents an email address as a value object with validation and email-specific operations.
 */
export class Email extends ValueObject<string> {
    [property: string]: unknown

    public override readonly value: string

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

    public override equals(other: Email | null | undefined): boolean {
        if (other === null || other === undefined) {
            return false
        }

        return this.value === other.value
    }

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
} //:: class
