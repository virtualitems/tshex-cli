### Entities

An entity is responsible for representing a domain concept with its own
identity.
Two entity instances refer to the same conceptual element when they share that
identity, even if other attributes change over time.

The generated template provides `Entity` as a base class for this pattern.

#### Base Class

`Entity` requires one operation and already provides two helper methods.

```ts title="shared/domain/entities.ts"
export abstract class Entity {
	public abstract equals(other: Entity): boolean

	public toJSON(): Record<string, unknown> {
		return this
	}

	public toString(): string {
		return String(this.constructor.name)
	}
}
```

Every concrete entity must implement `equals()`. The generated base class also
provides `toJSON()` and `toString()`.

#### First Entity

In the following example we model a user entity.

```ts title="users/domain/user.ts"
import { Entity } from '../../shared/domain/entities.js'
import { Email } from '../../shared/domain/value-objects.js'

export class User extends Entity {
	public constructor(
		public readonly id: string,
		public readonly email: Email,
	) {
		super()
	}

	public equals(other: Entity): boolean {
		return other instanceof User && this.id === other.id
	}
}
```

The identity rule lives in `equals()`. The entity compares the `id`, not the
email address, because the email can change while the entity still represents
the same user.

#### Included Behavior

Now that the entity exists, the inherited helpers become useful.

```ts
const user = new User('usr_1', Email.from('ada@example.com'))

user.toString()
user.toJSON()
```

`toString()` returns the constructor name. `toJSON()` returns the instance as a
plain record, which is convenient for simple serialization or inspection.

#### Equality Rules

The most important design decision in an entity is the identity comparison.

Correct identity candidates usually include:

1. a stable identifier;
2. a natural domain key that does not drift over time;
3. a combination of fields that the domain treats as unique.

Changing fields that are not part of the identity should not make `equals()`
return `false` for the same conceptual entity.

> **Hint**
> Keep `equals()` explicit and small. If the comparison starts depending on many
> mutable fields, the model may be closer to a value object than to an entity.

#### Next Step

When the identity of a concept is determined entirely by its value, use a value
object instead. The generated abstraction is documented in `value-objects.md`.