### `lib/types/timezones.d.ts`

This module constrains time-zone values to the IANA identifiers included in the
template. The union applies at compile time. It does not convert dates, apply
offsets, or verify the time-zone database available at runtime.

#### Current implementation

`timezones.d.ts` contains the complete generated union. The following excerpt
shows its form; the source file contains every included identifier.

```ts
export type TimeZone =
    | 'Africa/Abidjan'
    | 'Africa/Accra'
    | 'Africa/Addis_Ababa'
    | 'Africa/Algiers'
    | 'Africa/Asmara'
    ...
```

#### Example

Use `TimeZone` when an API or configuration accepts an IANA zone name.

```ts
const timeZone: TimeZone = 'America/Bogota'
```
