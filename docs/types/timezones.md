### Time Zones

`TimeZone` is a literal string union of every IANA time zone identifier.
It is used when a contract needs to accept only valid time zone names instead
of an open `string`.

#### Declaration

`TimeZone` lives in `types/timezones.d.ts` and is generated from the IANA time
zone database.

```ts title="types/timezones.d.ts"
export type TimeZone =
    | 'Africa/Cairo'
    | 'America/Argentina/Buenos_Aires'
    | 'America/Indiana/Indianapolis'
    | 'America/New_York'
    | 'Asia/Tokyo'
    | 'Australia/Sydney'
    | 'Europe/London'
    | 'Europe/Paris'
    | 'Pacific/Auckland'
    | 'UTC'
    // ...every other IANA time zone identifier
```

The generated file lists every canonical zone, including three-level entries
such as `'America/Argentina/Buenos_Aires'` and `'America/Indiana/Knox'`, and
ends with the fixed `'UTC'` identifier.

#### Basic Usage

```ts
import { type TimeZone } from './types/timezones.js'

function formatInZone(date: Date, timeZone: TimeZone): string {
    return date.toLocaleString('en-GB', { timeZone })
}

formatInZone(new Date(), 'America/New_York')
formatInZone(new Date(), 'UTC')
```

Because `TimeZone` only accepts identifiers the IANA database actually
defines, a typo such as `'America/New York'` (with a space) fails at compile
time instead of throwing a `RangeError` at runtime.

#### Combining With `Intl.DateTimeFormatOptions`

`TimeZone` is meant to replace the loosely typed `timeZone` member of
`Intl.DateTimeFormatOptions`.

```ts
import { type TimeZone } from './types/timezones.js'

const options: Intl.DateTimeFormatOptions & { timeZone: TimeZone } = {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
}
```

The intersection keeps every other formatting option from
`Intl.DateTimeFormatOptions` while narrowing `timeZone` to a real identifier.

#### Where It Is Used

`shared/application/loggers.ts` uses this same intersection for
`Logger.datetimeFormatOptions`, defaulting `timeZone` to `'UTC'`. See
`shared/application/loggers.md`.

> **Hint**
> `TimeZone` is a compile-time contract only. It does not validate that the
> runtime's ICU data actually supports every listed zone, and it does not
> account for future IANA database changes such as renamed or merged zones.
