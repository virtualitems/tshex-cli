### Data Contracts

The data template separates asynchronous connection management, persistence
manager behavior, and repository behavior. It supplies abstract contracts only;
the project implements the database driver and its concrete managers.

#### Connections

`DriverManager` opens a session asynchronously. `SessionManager` returns a
manager scoped to a resource and closes the session.

```ts title="shared/application/data/drivers.ts"
export abstract class SessionManager<ManagerShape extends DataManager = DataManager> {
    public abstract getDataManager(...args: unknown[]): ManagerShape

    public abstract disconnect(): Promise<void>
}

export abstract class DriverManager<
    SessionShape extends SessionManager = SessionManager
> {
    public abstract connect(...args: unknown[]): Promise<SessionShape>
}
```

The following minimal driver creates a `UsersManager` for the `users` resource.
The calling code connects before it requests the manager and releases the
session after the operation finishes.

```ts
import {
    DriverManager,
    SessionManager
} from './shared/application/data/drivers.ts'
import { DataManager } from './shared/application/data/managers.ts'

class UsersManager extends DataManager {}

class UsersSession extends SessionManager<UsersManager> {
    public getDataManager(...args: unknown[]): UsersManager {
        if (args[0] !== 'users') {
            throw new Error('Unknown resource')
        }

        return new UsersManager()
    }

    public async disconnect(): Promise<void> {}
}

class UsersDriver extends DriverManager<UsersSession> {
    public async connect(): Promise<UsersSession> {
        return new UsersSession()
    }
}

const session = await new UsersDriver().connect()

try {
    const users = session.getDataManager('users')
    console.log(users instanceof UsersManager)
    // true
} finally {
    await session.disconnect()
}
```

The session owns the connection lifetime. A manager owns operations against the
resource selected by `getDataManager()`.

#### Managers

`DataManager` is the common base class. `SqlDataManager` adds protected helpers
for SQL parameter fragments, and `DatasetManager` defines set operations over
an in-memory typed collection.

`SqlDataManager.buildUpdateParams()` omits an `id` field in the input and
appends the target entity's `id` after the update values. A concrete manager can
use the result to bind an `UPDATE ... WHERE id = ?` statement.

```ts
type User = { id: number, email: string }

class UsersManager extends SqlDataManager {
    public updateParams(data: Partial<User>, user: User) {
        return this.buildUpdateParams(data, user)
    }
}

const manager = new UsersManager()
manager.updateParams({ id: 99, email: 'ada@example.com' }, { id: 204, email: 'old@example.com' })
// { placeholders: ['email = ?'], values: ['ada@example.com', 204] }
```

`managers.ts` also declares `Executable` for SQL mutation statements and
`Queryable` for SQL query statements. A concrete manager implements either
contract only when it supports that operation.

#### Repositories

`Repository` holds a manager and requires `transform()` to map a raw record to
an `Entity`. Its optional operation contracts are `Listable`, `Filterable`,
`Creatable`, `Updateable`, and `Deletable`.

```ts title="shared/application/data/repositories.ts"
export abstract class Repository<ManagerShape = DataManager> {
    public constructor(public readonly manager: ManagerShape) {}

    protected abstract transform(data: Record<string, unknown>): Entity
}
```

Implement only the repository contracts that the context exposes. The template
does not require a repository to provide every CRUD operation.
