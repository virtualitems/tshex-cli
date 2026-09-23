### `lib/shared/application/data/drivers.ts`

This module defines the connection lifecycle between the application and a
data source. A driver opens a session, and the session closes the resources
used for that connection.

#### Current implementation

The following code is the current module implementation.

```ts
import { DataManager } from './managers.ts'

export abstract class SessionManager<ManagerShape extends DataManager = DataManager> {
    [property: string]: unknown

    public abstract getDataManager(...args: unknown[]): ManagerShape

    public abstract disconnect(): Promise<void>
}

export abstract class DriverManager<
    SessionShape extends SessionManager = SessionManager
> {
    [property: string]: unknown

    public abstract connect(...args: unknown[]): Promise<SessionShape>
}
```

#### Example

Connect to obtain a session and disconnect when the caller has finished using
the connection. No data operation occurs in either step.

```ts
const session = await driver.connect()

await session.disconnect()
```
