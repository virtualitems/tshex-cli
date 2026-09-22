### `lib/shared/domain/entities.ts`

An entity is the operational boundary for one domain element. It keeps the
state and domain behavior of that element together. Its identity distinguishes
the element from other elements, even when its state changes.

`Identifiable<T>` defines a typed `id` property. `Slugable<T>` defines a typed
`slug` property.

#### Current implementation

The following code is the current implementation of `Entity`, `Identifiable`,
and `Slugable`.

```ts
export interface Identifiable<T extends unknown = number> {
    readonly id: T
}

export interface Slugable<T extends unknown = string> {
    readonly slug: T
}

export abstract class Entity {
    [property: string]: unknown

    public abstract equals(other: Entity): boolean

    public toJSON(): Record<string, unknown> {
        return this
    }

    public toString(): string {
        return this.constructor.name
    }
}
```

#### Example

A user entity uses its `id` to determine whether another entity represents the
same user.

```ts
class User extends Entity implements Identifiable<number> {
  public constructor(public readonly id: number) {
    super()
  }

  public equals(other: Entity): boolean {
    const isUser = other instanceof User

    if (isUser === false) {
      return false
    }

    return this.id === other.id
  }
}
```
