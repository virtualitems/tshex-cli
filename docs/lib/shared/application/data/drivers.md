### `lib/shared/application/data/drivers.ts`

`DriverManager` opens an asynchronous persistence session. `SessionManager`
returns a data manager scoped to caller-provided arguments and closes that
session.

#### Acquire and release a session

```ts
const session = await driver.connect()

try {
    const users = session.getDataManager('users')
} finally {
    await session.disconnect()
}
```

The abstract contracts do not implement a connection, transaction, pooling, or
error policy. A concrete driver defines the manager arguments and must release
the resources it opens.
