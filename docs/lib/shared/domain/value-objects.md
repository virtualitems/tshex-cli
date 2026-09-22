### `lib/shared/domain/value-objects`

A value object is the operational boundary for one domain value. It keeps the
value and the behavior that gives that value domain meaning together. A value
object's identity is determined by its value. Two value objects are equivalent
when their values are equal under the equality rule defined by the value
object.

A value object adds format validation or data operations that belong to the
domain value it represents.

A value does not need a value object when it has no associated domain behavior
and no required format. For example, a product name can remain a `string` when
the domain does not impose operations or a format on that name.

#### Current implementation

The following code is the current `ValueObject` contract.

```ts
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
        return value !== null && value !== undefined && Object.is(value, NaN) === false
    }
}
```

#### Available value objects

`Email` stores a validated email address. It exposes `username`, `domain`, and
`tld`. Its validation checks the supplied string format only; it does not
confirm that the mailbox or domain exists. `Email.from()` throws `ValueError`
when the string does not match the email expression.

`NullableBoolean` stores `true`, `false`, or `null`. A `null` value represents
an indeterminate domain state, which `isIndeterminate()` identifies.
`NullableBoolean.from()` accepts only a Boolean or `null`, so an adapter must
parse string and numeric input before construction.

`ValueError` reports a rejected value and the expected value-object name. Its
message does not include a field name, validation code, HTTP status, or cause.

#### Example

The following example validates, creates and inspects an email value.

```ts
const email = Email.from('ada@example.com')

const username = email.username
const domain = email.domain
const topLevelDomain = email.tld
```
