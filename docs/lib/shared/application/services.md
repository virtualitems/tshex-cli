### `lib/shared/application/services.ts`

`Service` is an empty abstract base class for an application operation.

#### Name an application operation

```ts
class RefreshCatalog extends Service {
    public execute(): void {
        // coordinate the catalog refresh operation
    }
}
```

The base class does not define an `execute()` method, dependencies, a
transaction boundary, or a result type. The concrete service owns that contract.
