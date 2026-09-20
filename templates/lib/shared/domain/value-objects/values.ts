/**
 * @description Abstract base for domain value objects that wrap a typed value and enforce equality.
 */
export abstract class ValueObject<T = unknown> {
    [property: string]: unknown

    public abstract readonly value: T

    /**
     * @description Returns the string representation of the wrapped value.
     */
    public toString(): string {
        return String(this.value)
    }

    /**
     * @description Returns the raw wrapped value for JSON serialization.
     */
    public toJSON(): T {
        return this.value
    }

    /**
     * @description Compares this value object against another for equality.
     */
    public abstract equals(other: ValueObject<T> | null | undefined): boolean

    /**
     * @description Returns true when the value is neither null, undefined, nor NaN.
     */
    public static isValid(value: unknown): boolean {
        return value !== null && value !== undefined && Object.is(value, NaN) === false
    }
} //:: class
