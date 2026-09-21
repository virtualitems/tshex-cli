### `lib/shared/application/providers.ts`

`providers.ts` provides synchronous and asynchronous dependency injection
containers. Both containers register factories by typed string token and cache
each resolved instance.

#### Register a dependency

```ts
class Clock {}

type Dependencies = { Clock: Clock }

const container = new DependencyInjectionContainer<Dependencies>()
container.register({ Clock: { factory: () => new Clock() } })

const clock = container.resolve('Clock')
```

The containers reject duplicate tokens and report dependency cycles through
`CircularDependencyError`. The asynchronous container requires factories that
return promises and serializes concurrent resolution calls. Both containers
accept object instances only through their dependency map.
