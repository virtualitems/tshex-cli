### Aggregates

An aggregate is responsible for grouping multiple entities into one logical
domain unit.
It is used when the behavior of the concept depends on the collaboration of
several entities instead of a single entity in isolation.

The generated template provides `Aggregate` as a semantic base class.

#### Base Class

`Aggregate` is an abstract class with no concrete methods.

```ts title="shared/domain/aggregates.ts"
export abstract class Aggregate {}
```

This means the generated base class does not impose persistence rules, event
publication, or identity behavior. Those concerns remain in the concrete domain
model of the project.

#### First Aggregate

In the following example we model a shopping cart as a group of line items.

```ts title="users/domain/cart.ts"
import { Aggregate } from '../../shared/domain/aggregates.js'
import { Entity } from '../../shared/domain/entities.js'

class LineItem extends Entity {
	public constructor(
		public readonly id: string,
		public readonly quantity: number,
	) {
		super()
	}

	public equals(other: Entity): boolean {
		return other instanceof LineItem && this.id === other.id
	}
}

export class Cart extends Aggregate {
	public constructor(public readonly items: Array<LineItem>) {
		super()
	}

	public totalItems(): number {
		return this.items.reduce((sum, item) => sum + item.quantity, 0)
	}
}
```

`Cart` is an aggregate because its behavior depends on the collection of
entities that compose it. `LineItem` remains an entity because its identity is
independent inside the aggregate.

#### Responsibility Boundary

An aggregate should own rules that require several internal parts to work
together.

Examples include:

1. checking whether the aggregate can change status;
2. keeping related entities in a consistent state;
3. exposing operations that depend on the collaboration of those entities.

The generated `Aggregate` base class does not implement these rules for you. It
only provides the semantic place where those rules belong.

> **Warning**
> Do not extend `Aggregate` only to create a container for unrelated values. Use
> it when the concept represents one domain unit composed of several parts.

#### Next Step

Aggregates usually collaborate with entities and value objects. The base entity
behavior is documented in `entities.md`.