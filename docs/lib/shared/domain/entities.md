### `lib/shared/domain/entities.ts`

`entities.ts` defines `Entity`, `Identifiable<T>`, and `Slugable<T>`. An entity
must implement equality, while the two interfaces describe typed `id` and
`slug` properties.

#### Identity-based equality

```ts
class User extends Entity implements Identifiable<number> {
    public constructor(public readonly id: number) { super() }

    public equals(other: Entity): boolean {
        return other instanceof User && this.id === other.id
    }
}
```

`Entity.toJSON()` returns the instance, and `toString()` returns the class
name. Override `toJSON()` when the serialized form must omit or transform
fields. The base class does not select an identity rule for the entity.
