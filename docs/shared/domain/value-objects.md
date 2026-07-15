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

#### Custom Value Object

In the following example we create a local value object for percentages.

```ts title="users/domain/percentage.ts"
import { ValueObject } from '../../shared/domain/value-objects.js'
import { ValueError } from '../../shared/domain/errors.js'

export class Percentage extends ValueObject<number> {
	public override readonly value: number

	protected constructor(value: number) {
		super()
		this.value = value
	}

	public override equals(
		other: Percentage | null | undefined,
	): boolean {
		if (other === null || other === undefined) {
			return false
		}

		return this.value === other.value
	}

	public static from(value: number): Percentage {
		if (value < 0 || value > 100) {
			throw new ValueError(String(value), Percentage.name)
		}

		return new Percentage(value)
	}
}
```

`Percentage` owns the validation rule of the concept and the equality rule of
the value. This is the normal responsibility split for a value object.

#### NullableBoolean

`NullableBoolean` is responsible for representing a tri-state Boolean.

```ts title="shared/domain/value-objects.ts"
import { NullableBoolean } from '../../shared/domain/value-objects.js'

const active = NullableBoolean.from(true)
const unknown = NullableBoolean.from(null)

active.equals(NullableBoolean.from(true))
unknown.isIndeterminate()
```

`from(value)` accepts `true`, `false`, or `null`. `equals()` compares the wrapped
value. `isIndeterminate()` returns `true` when the state is `null`.

#### Email

`Email` is responsible for validating and describing an email address.

```ts title="shared/domain/value-objects.ts"
import { Email } from '../../shared/domain/value-objects.js'

const email = Email.from('ada@example.com')

email.username
email.domain
email.tld
```

`Email.from()` validates the string and throws `ValueError` when the input does
not match the generated email rules. The getters expose common derived parts of
the address without repeating parsing logic in the rest of the domain.

#### Full Example

The following example combines both generated value objects in one small domain
shape.

```ts title="users/domain/user-profile.ts"
import { Email, NullableBoolean } from '../../shared/domain/value-objects.js'

type UserProfile = {
	email: Email
	active: NullableBoolean
}

const profile: UserProfile = {
	email: Email.from('ada@example.com'),
	active: NullableBoolean.from(null),
}
```

This example keeps the domain data explicit. The email carries its own
validation and derived fields. The active flag carries its own tri-state
semantics.

> **Warning**
> Use a value object only when equality depends on the value itself. If the
> concept must preserve identity independently from changing attributes, model it
> as an entity instead.

#### Next Step

After modeling values, the next step is usually to compose them inside entities
or aggregates.