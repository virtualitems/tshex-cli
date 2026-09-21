### Environment Adapter

`shared/application/adapters/env.ts` provides the initial record for values
that an environment-specific adapter supplies. The library template does not
read `process.env`, `Deno.env`, or any other runtime API.

```ts title="shared/application/adapters/env.ts"
export const env: Record<string, string> = {}
```

For example, a Node.js adapter can populate the record before application code
uses it.

```ts
import { env } from './shared/application/adapters/env.ts'

const port = process.env.PORT

if (port !== undefined) {
    env.PORT = port
}
```

After the assignment, `env.PORT` contains the value supplied by the Node.js
process. The generated module also contains local functions that check required
values and convert strings to integers, floats, and booleans. The template does
not export those functions, so application modules cannot call them until the
project exposes or replaces them.
