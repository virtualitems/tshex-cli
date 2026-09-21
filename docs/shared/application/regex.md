### Regular Expressions

`shared/application/regex.ts` exports patterns for decimal identifiers and
RFC 4122-style UUID strings.

```ts title="shared/application/regex.ts"
export const ID_PATTERN = /^\d+$/

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
```

The identifier pattern accepts one or more ASCII digits. The UUID pattern
accepts versions one through five and is case-insensitive.

```ts
import { ID_PATTERN, UUID_PATTERN } from './shared/application/regex.ts'

ID_PATTERN.test('204')
// true

UUID_PATTERN.test('550e8400-e29b-41d4-a716-446655440000')
// true
```

Use the patterns to validate the full input string. Both patterns include start
and end anchors, so they do not match a valid identifier or UUID embedded in a
longer string.
