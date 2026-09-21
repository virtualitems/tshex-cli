### `lib/types/timezones.d.ts`

`timezones.d.ts` declares `TimeZone` as the IANA time-zone identifier union
included in the template.

#### Constrain time-zone fields

Use `TimeZone` when an API or configuration accepts an IANA zone name.

```ts
const timeZone: TimeZone = 'America/Bogota'
```

#### Runtime time-zone handling

The union constrains TypeScript values only. It does not convert dates, apply
offsets, or verify the time-zone database available in the running environment.
