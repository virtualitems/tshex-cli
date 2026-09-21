### `lib/shared/application/events.ts`

`events.ts` contains the `Event` base class, the `EventHandler` base class, and
the `EventDispatcher` subscription contract.

#### Publish an application event

```ts
class UserCreated extends Event {}

const event = new UserCreated(Date.now(), { id: 204 })
```

An event stores a timestamp and a plain details object. The contracts do not
define event persistence, delivery ordering, retries, handler selection, or
asynchronous dispatch.
