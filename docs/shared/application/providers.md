### Dependency Injection

`shared/application/providers.ts` exports
`DependencyInjectionContainer` and `AsyncDependencyInjectionContainer`. Both
containers register lazy factories by string token and cache a factory result
after the first successful resolution.

#### Synchronous Container

The synchronous container resolves a factory and its dependencies in one graph.

```ts
import { DependencyInjectionContainer } from './shared/application/providers.ts'

class Clock {
    public now(): number {
        return Date.now()
    }
}

type Dependencies = { Clock: Clock }

const container = new DependencyInjectionContainer<Dependencies>()

container.register({
    Clock: {
        factory: () => new Clock()
    }
})

const first = container.resolve('Clock')
const second = container.resolve('Clock')

first === second
// true
```

The first `resolve('Clock')` calls the factory. The second call returns the
cached `Clock` instance. `register()` rejects a token that is already
registered. `unregister()` removes one token, and `clear()` removes all tokens
and cached instances.

Factories receive a typed resolver. They can call `resolve()` to request a
dependency that the same container registered.

```ts
type Dependencies = { Clock: Clock, Service: Service }

class Service {
    public constructor(public readonly clock: Clock) {}
}

const container = new DependencyInjectionContainer<Dependencies>()

container.register({
    Clock: { factory: () => new Clock() },
    Service: { factory: resolver => new Service(resolver.resolve('Clock')) }
})
```

The container detects a cycle in the resolution graph and throws
`CircularDependencyError` with the repeated token path. It commits resolved
instances only after the full requested graph resolves successfully.

#### Asynchronous Container

Use `AsyncDependencyInjectionContainer` when factories return promises.

```ts
import { AsyncDependencyInjectionContainer } from './shared/application/providers.ts'

class Configuration {
    public constructor(public readonly url: string) {}
}

type Dependencies = { Configuration: Configuration }

const container = new AsyncDependencyInjectionContainer<Dependencies>()

container.register({
    Configuration: {
        factory: async () => new Configuration('https://api.example.com')
    }
})

const configuration = await container.resolve('Configuration')
```

The asynchronous container queues concurrent `resolve()` calls. Each call
finishes its dependency graph before the next call starts.
