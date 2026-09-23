### Context Ports

A context port is the boundary module that exposes a context capability to
other modules. A caller imports the port and invokes its operations. The port
delegates the request to the application layer, which executes the use case.

At startup, a port module composes the context. It creates the adapters that
the context requires and injects them into the application services that use
them. The port is the point where the adapters and application layers are
wired together without making either layer construct the other.

Only port modules may import `env.ts`. A port uses the exported configuration
values to select or configure adapters, then creates the application services
that form the context bootstrap.

Place port modules at the context root. Name each file and exported element
after the capability group it exposes. Use names that identify the provided
capability. Avoid generic filenames such as `index.ts` and `main.ts`, and do
not use the `Port.ts` suffix because it does not identify the capability.

#### Generated placeholder

The generated `example.ts` marks the context root as the location for ports.
Replace it when the context exposes its first capability.

```ts
export class Example {
    public doSomething(): void {
    }
}
```

#### Example

The following port exposes the operation that lists students. `StudentsService`
belongs to the application layer of the same context.

```ts
import { StudentsService } from './application/services.ts'

export class Roster {
  public constructor(
    protected readonly service: StudentsService
  ) {}

  public all(): Record<string, unknown>[] {
    const students = this.service.all()

    return students
  }
}
```
