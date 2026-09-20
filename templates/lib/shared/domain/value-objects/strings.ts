import { ValueObject } from './values.ts'
import { ValueError } from './errors.ts'

const VALID_EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

/**
 * @description Value object that wraps a validated email address string.
 */
export class Email extends ValueObject<string> {
    [property: string]: unknown

    public override readonly value: string

    protected constructor(value: string) {
        super()
        this.value = value
    }

    /**
     * @description Returns the local part of the email address (before the @ symbol).
     */
    get username(): string | undefined {
        return this.value.split('@').shift()
    }

    /**
     * @description Returns the domain part of the email address (after the @ symbol).
     */
    get domain(): string | undefined {
        return this.value.split('@').pop()
    }

    /**
     * @description Returns the top-level domain extracted from the email domain.
     */
    get tld(): string | undefined {
        return this.domain?.split('.').pop()
    }

    /**
     * @description Returns true when the other Email instance holds the same address.
     */
    public override equals(other: Email | null | undefined): boolean {
        if (other === null || other === undefined) {
            return false
        }

        return this.value === other.value
    }

    /**
     * @description Returns true when the value is a string matching the email format.
     */
    public static override isValid(value: unknown): boolean {
        if (super.isValid(value) === false) return false

        return 'string' === typeof value && VALID_EMAIL_REGEX.test(value)
    }

    /**
     * @description Creates an Email from a raw string value.
     * @throws {ValueError} When the value does not match the email format.
     */
    public static from(value: string): Email {
        if (this.isValid(value) === false) throw new ValueError(value, this.name)

        return new this(value)
    }
} //:: class
