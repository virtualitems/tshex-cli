### `lib/shared/application/providers.ts`

Providers supply the dependencies that application operations require. A
provider associates a string token with a factory, so consumers request a
dependency without constructing its concrete implementation.

`DependencyInjectionContainer` resolves synchronous factories.
`AsyncDependencyInjectionContainer` resolves factories that return promises.
Both containers cache resolved instances, reject duplicate registrations, and
report circular dependency paths through `CircularDependencyError`. The async
container serializes concurrent resolutions.

#### Current implementation

`providers.ts` defines the dependency maps, registration contracts, resolver
contracts, containers, and `CircularDependencyError` used for dependency
provisioning.

#### Example

The following container registers a clock factory under the `Clock` token.
Resolving the token returns the factory result and caches that instance for
later resolutions.

```ts
interface Clock {
  now(): Date
}

interface Dependencies {
  Clock: Clock
}

const container = new DependencyInjectionContainer<Dependencies>()

container.register({
  Clock: {
    factory: (): Clock => ({ now: (): Date => new Date() })
  }
})

const clock = container.resolve('Clock')
```
