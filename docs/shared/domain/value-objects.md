### Value Objects

Value objects are responsible for modeling concepts whose identity is
determined entirely by their value.
They are used to keep domain rules, comparisons, and semantics close to the
data that those rules describe.

The generated template provides the abstract `ValueObject<T>` base class and two
concrete implementations: `NullableBoolean` and `Email`.

#### Base Class

`ValueObject<T>` is responsible for storing a value and defining its comparison
rules.

```ts title="shared/domain/value-objects.ts"
export abstract class ValueObject<T = unknown> {
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
}
```

The base class provides serialization helpers and a generic validation check.
Concrete value objects must define `value` and `equals()`.

#### NullableBoolean

`NullableBoolean` is responsible for representing a tri-state Boolean.

```ts title="shared/domain/value-objects.ts"
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
}
```

`from(value)` accepts `true`, `false`, or `null`. `equals()` compares the wrapped
value. `isIndeterminate()` returns `true` when the state is `null`.

```ts
const active = NullableBoolean.from(true)
const unknown = NullableBoolean.from(null)

active.equals(NullableBoolean.from(true))
unknown.isIndeterminate()
```

#### Email

`Email` is responsible for validating and describing an email address.

```ts title="shared/domain/value-objects.ts"
import { Email } from '../../shared/domain/value-objects.ts'

const email = Email.from('alice@example.com')

email.username  // 'alice'
email.domain    // 'example.com'
email.tld       // 'com'
```

`Email.from()` validates the string and throws `ValueError` when the input does
not match the generated email rules. The getters expose common derived parts of
the address without repeating parsing logic in the rest of the domain.

#### Full Example

The following example shows `Email` used as the identity of a `Student` entity.

```ts title="students/domain/students.ts"
import { Entity } from '../../shared/domain/entities.ts'
import { Email } from '../../shared/domain/value-objects.ts'

export class Student extends Entity {
    [property: string]: unknown

    public name: string
    public email: Email

    public constructor(name: string, email: Email) {
        super()

        this.name = name
        this.email = email
    }

    public override equals(other: Entity): boolean {
        if ((other instanceof Student) === false) return false

        const student = other as Student

        return this.email.equals(student.email)
    }

    public override toJSON() {
        return {
            name: this.name,
            email: this.email.value
        }
    }
}

const alice = new Student('Alice', Email.from('alice@example.com'))
const bob = new Student('Bob', Email.from('bob@example.com'))

alice.equals(bob)  // false — different emails
```

`Student` delegates identity to `Email`, so the comparison rule lives in the
value object and `Student.equals()` stays focused on its own concept.

> **Warning**
> Use a value object only when equality depends on the value itself. If the
> concept must preserve identity independently from changing attributes, model it
> as an entity instead.

#### Next Step

After modeling values, the next step is usually to compose them inside entities
or aggregates.
