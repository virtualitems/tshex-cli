### Context Ports

Context ports define the communication available at a context boundary.
They describe what data enters the context, what data leaves it, and which
operation another system can invoke.

Ports are used to keep communication contracts explicit. An adapter imports a
port, implements that contract, and translates the external interaction into an
application process.

> **Hint**
> The generated `example-ports.ts` file is only a placeholder. Replace it when
> the first real interaction of the context becomes clear.

#### Root Port File

The generated context starts with a single root file for ports.

```ts title="users/example-ports.ts"
export function example(): void {
    // ...
}
```

This placeholder does not define a real contract yet. Its purpose is to mark
the context root as the place where boundary-facing types and interfaces live.

#### First Contract

In the following example we replace the placeholder with a minimal contract for
creating a user.

```ts title="users/example-ports.ts"
export type CreateUserRequest = {
    user: {
        id: string
        email: string
        active: boolean | null
    }
}

export type CreateUserResponse = {
    user: {
        id: string
        email: string
        active: boolean | null
    }
}

export interface CreateUserPort {
    create(request: CreateUserRequest): Promise<CreateUserResponse>
}
```

`CreateUserRequest` defines the incoming payload. `CreateUserResponse` defines
the outgoing payload. `CreateUserPort` exposes the operation available at the
boundary.

This contract says nothing about HTTP, queues, or databases. It only declares
the shape of the communication.

#### Adapter Implementation

Now that the port exists, an adapter can implement it and delegate the work to
an application service.

```ts title="users/adapters/create-user.ts"
import type {
    CreateUserPort,
    CreateUserRequest,
    CreateUserResponse,
} from '../example-ports.js'

type CreateUserService = {
    execute(data: {
        id: string
        email: string
        active: boolean | null
    }): Promise<CreateUserResponse>
}

export class CreateUserAdapter implements CreateUserPort {
    public constructor(
        private readonly service: CreateUserService,
    ) {}

    public async create(
        request: CreateUserRequest,
    ): Promise<CreateUserResponse> {
        return this.service.execute({
            id: request.user.id,
            email: request.user.email,
            active: request.user.active,
        })
    }
}
```

The adapter implements `CreateUserPort`, so it must provide `create()`. Inside
that method it translates the root-level request into the input expected by the
application service.

This is the normal flow of the generated structure:

```text
external system -> adapter -> application -> domain
```

The port belongs to the boundary. The adapter materializes the boundary. The
application process executes the use case.

#### Multiple Port Files

As the context grows, you can keep several contracts at the context root.

```ts title="users/list-users.ts"
export type ListUsersRequest = {
    active: boolean | null
}

export type ListUsersResponse = {
    users: Array<{
        id: string
        email: string
        active: boolean | null
    }>
}

export interface ListUsersPort {
    list(request: ListUsersRequest): Promise<ListUsersResponse>
}
```

An adapter can then import the contract from the file that owns it.

This arrangement is useful when one context exposes several independent forms
of communication. A single file works well for a small context. Separate files
become easier to maintain when responsibilities start to diverge.

> **Warning**
> A port should define communication, not domain behavior. Avoid moving entity
> rules, repository logic, or infrastructure details into the port file.

#### Example Layout

The following structure keeps ports at the root while the implementation lives
in the generated folders.

```text
users/
├── example-ports.ts
├── list-users.ts
├── adapters/
├── application/
└── domain/
```

This layout keeps the context boundary visible from the top level. It also
reduces coupling between adapters because they all import the same contracts.

#### Next Step

After defining a port, implement the corresponding adapter and connect it to an
application service. The surrounding structure is described in
`library-structure.md`.