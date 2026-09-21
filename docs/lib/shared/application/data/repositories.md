### `lib/shared/application/data/repositories.ts`

`repositories.ts` declares a `Repository` base class that owns a manager and
transforms raw records into `Entity` instances. It also provides opt-in
contracts for list, filter, create, update, and delete operations.

#### Add the operations a context exposes

```ts
// Excerpt: User and UsersManager are types defined by the context.
class UsersRepository extends Repository<UsersManager> implements Listable<User> {
    public all(): User[] {
        return []
    }

    protected transform(data: Record<string, unknown>): User {
        return new User(Number(data.id))
    }
}
```

The base class does not retrieve, persist, or validate data. A repository only
implements the operation contracts that its context needs.
