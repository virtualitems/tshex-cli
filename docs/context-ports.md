### Context Ports

Context ports define the communication available at a context boundary.
They describe which concrete capability a context exposes, what data enters
that capability, and what data it returns.

In practice a port is a specific boundary element of the system with identity:
a command handler, a query entry point, an event consumer, a published
endpoint, or another concrete interaction mechanism that exists because the
running system exposes it.

Types and interfaces still matter, but they are secondary. Their role is to
make the port explicit. The main concern is the port as a real executable
surface that another actor can call or observe.

> **Hint**
> The generated `example-ports.ts` file is only a placeholder. Replace it when
> the first real interaction of the context becomes clear.

#### Root Port File

The generated context starts with a single root file for ports.

```ts title="users/example-ports.ts"
export class ExamplePort {
    public doSomething(): void {
        // ...
    }
}
```

This placeholder marks the context root as the place where boundary-facing
capabilities are declared. Replace it with the first module that defines a real
port of the context when that capability becomes clear.

Context root `.ts` files belong to this same boundary surface. Each one is
expected to be a module that defines one or more context ports.

#### First Port

In the following example we replace the placeholder with a concrete port for
creating a user.

```ts title="users/example-ports.ts"
export interface User {
    id: string
    email: string
    active: boolean | null
}

export class UsersRegistry {
    public async createUser(user: User): Promise<User> {
        // ...
    }
}
```

`User` expresses the user data that crosses the boundary. `UsersRegistry` is a
boundary object of the context and `createUser()` is one concrete capability
that it exposes.

This definition focuses on the interaction the context makes available. The
port keeps its identity as one boundary capability while making its data and
action explicit.

The port is the executable object that this context exposes. Types help
describe it and make its boundary explicit.

This is the normal flow inside the context boundary:

```mermaid
flowchart LR
    caller["Caller"] --> port[Concrete port]
    port --> application[Application]
    application --> domain[Domain]
```

The port belongs to the boundary because it is part of what the context
exposes. The application process executes the use case behind the exposed
capability and uses domain capabilities.

#### Multiple Port Files

As the context grows, you can keep several port modules at the context root.

```ts title="users/registry.ts"
export class UsersRegistry {
    public async listUsers(): Promise<User[]> {
        // ...
    }
}
```

Another caller can then import the port from the file that owns it.

This arrangement is useful when one context exposes several independent
capabilities. A single file works well for a small context. Separate files
become easier to maintain when each port has its own identity and
responsibility.

> **Warning**
> A port should define an exposed boundary capability.
> Keep business rules, repository logic, and infrastructure details in their
> corresponding layers.

#### Example Layout

The following structure keeps ports at the root while the implementation lives
in the generated folders.

```mermaid
flowchart TD
    users["users/"] --> registry["registry.ts"]
    users --> application["application/"]
    users --> domain["domain/"]
```

This layout keeps the context boundary visible from the top level. It also
makes each exposed capability easy to locate because the port modules stay at
the root of the context.

#### Next Step

After defining a port, implement the corresponding executable path and connect
it to an application service. The surrounding structure is described in
`library-structure.md`.
