### `lib/shared/application/data/repositories.ts`

This module defines repositories as translators between code that accesses a
data source and application operations that use domain entities. A repository
converts flat records into domain entities and converts domain entities into
records when a data context must persist them. A repository does not query,
store, or otherwise interact with a data source.

#### Current implementation

The following code is the current module implementation.

```ts
import { type DataManager } from './managers.ts'
import { Entity, Identifiable } from '../../domain/entities.ts'

type Generic = Record<string, unknown>

export interface Listable<ItemShape = Entity> {
    all(): Array<ItemShape>
}

export interface Filterable<ItemShape = Entity> {
    filter(...args: unknown[]): Array<ItemShape>
}

export interface Updateable<
    ItemShape = Entity & Identifiable,
    ResultShape extends unknown = boolean
> {
    update(target: ItemShape, data: Partial<ItemShape>): ResultShape
}

export interface Creatable<
    ItemShape = Entity,
    ResultShape extends unknown = boolean
> {
    create(data: ItemShape): ResultShape
}

export interface Deletable<
    ItemShape = Entity & Identifiable,
    ResultShape extends unknown = boolean
> {
    delete(target: ItemShape): ResultShape
}

export abstract class Repository<
    ManagerShape = DataManager
> {
    [property: string]: unknown

    public constructor(
        public readonly manager: ManagerShape
    ) {}

    protected abstract transform(data: Generic): Entity
}
```

#### Example

A user repository converts a persistence record into a user entity and a user
entity into a persistence record. Neither conversion accesses a data source.
`User` and `UsersManager` belong to the data context that defines the
repository.

```ts
class UsersRepository
  extends Repository<UsersManager>
  implements Listable<User> {
  public all(): User[] {
    return []
  }

  protected transform(data: Record<string, unknown>): User {
    const id = Number(data.id)
    const user = new User(id)

    return user
  }

  public toRecord(user: User): Record<string, unknown> {
    const record = { id: user.id }

    return record
  }
}
```
