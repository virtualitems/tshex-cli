### `lib/shared/application/data/managers.ts`

`managers.ts` declares `DataManager`, `SqlDataManager`, and `DatasetManager`.
It also declares `Executable` and `Queryable` contracts for SQL operations.

#### SQL parameter helpers

`SqlDataManager` exposes protected helpers to subclasses. The update helper
omits `id` from its data record and appends the target entity identifier.

```ts
class UsersManager extends SqlDataManager {
    public where(data: Record<string, unknown>) {
        return this.buildWhereParams(data)
    }
}
```

`DataManager` has no operations. `DatasetManager` requires concrete set
operations. The SQL helpers use `?` placeholders and do not run statements.
