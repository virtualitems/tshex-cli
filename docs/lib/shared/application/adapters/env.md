### `lib/shared/application/adapters/env.ts`

`env.ts` exports an initially empty `Record<string, string>` for an
environment-specific adapter to populate.

#### Populate runtime values

```ts
env.PORT = '3000'
```

The file does not read `process.env`, `Deno.env`, or another runtime API. Its
local conversion and required-value helpers are not exported, so calling code
cannot use them until the project changes the module.
