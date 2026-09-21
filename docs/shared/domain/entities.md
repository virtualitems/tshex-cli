### Entities

`shared/domain/entities.ts` contains `Entity`, `Identifiable<T>`, and
`Slugable<T>`. `Entity` requires an equality rule and provides default JSON and
string representations.

```ts title="shared/domain/entities.ts"
export interface Identifiable<T = number> {
    readonly id: T
}

export interface Slugable<T = string> {
    readonly slug: T
}

export abstract class Entity {
    public abstract equals(other: Entity): boolean

    public toJSON(): Record<string, unknown> {
        return this
    }

    public toString(): string {
        return this.constructor.name
    }
}
```

For example, an entity can define equality through a stable identifier.

```ts
import { Entity, Identifiable } from '../../shared/domain/entities.ts'

class User extends Entity implements Identifiable<number> {
    public constructor(
        public readonly id: number,
        public name: string
    ) {
        super()
    }

    public equals(other: Entity): boolean {
        return other instanceof User && this.id === other.id
    }
}

new User(204, 'Ada').equals(new User(204, 'Ada Lovelace'))
// true
```

The example compares `id`, not `name`, because an entity keeps its identity
when a mutable attribute changes. Override `toJSON()` when the default object
representation exposes fields that the application must omit or transform.
