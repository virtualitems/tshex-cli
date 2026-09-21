### `lib/shared/domain/aggregates.ts`

`Aggregate` is an empty abstract base class for a domain object that owns a
consistency boundary across related entities and value objects.

#### Aggregate operations

Extend `Aggregate` when one operation must coordinate several domain parts.

```ts
class Order extends Aggregate {
    public confirm(): void {
        // enforce the order's consistency rules
    }
}
```

The base class does not provide persistence, identity, validation, or
transaction handling. The concrete aggregate defines those domain rules.
