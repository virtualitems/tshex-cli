### `lib/shared/application/regex.ts`

This module centralizes the regular expressions that the application uses to
recognize and validate string formats. Each expression validates a string
shape; it does not query data or convert a matching value to another type.

#### Current implementation

The following code is the current module implementation.

```ts
export const ID_PATTERN = /^\d+$/

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
```

#### Example

Use `ID_PATTERN` to validate a decimal identifier and `UUID_PATTERN` to
validate a UUID from version one through five. Both patterns match the complete
input because they use start and end anchors.

```ts
const isID = ID_PATTERN.test('204')
const isUUID = UUID_PATTERN.test('550e8400-e29b-41d4-a716-446655440000')
```

`isID` and `isUUID` are `true` for these inputs.
