import { ValueObject } from './values.ts'

/**
 * @description Value object that wraps a boolean that may be null to represent an indeterminate state.
 */
export class NullableBoolean extends ValueObject<boolean | null> {
    [property: string]: unknown

    public override readonly value: boolean | null

    protected constructor(value: boolean | null) {
        super()
        this.value = value
    }

    /**
     * @description Returns true when the other NullableBoolean holds the same value.
     */
    public override equals(other: NullableBoolean | null | undefined): boolean {
        if (other === null || other === undefined) return false
        return this.value === other.value
    }

    /**
     * @description Returns true when the wrapped value is null (indeterminate state).
     */
    public isIndeterminate(): boolean {
        return this.value === null
    }

    /**
     * @description Creates a NullableBoolean from a boolean or null value.
     */
    public static from(value: boolean | null): NullableBoolean {
        return new this(value)
    }
} //:: class
