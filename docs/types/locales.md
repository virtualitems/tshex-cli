### Locales

`Locale` is a literal string union of every locale identifier available in
Unicode CLDR.
It is used when a contract needs to accept only valid locale tags instead of
an open `string`.

#### Declaration

`Locale` lives in `types/locales.d.ts` and is generated from Unicode CLDR
48.2.1.

```ts title="types/locales.d.ts"
export type Locale =
    | 'aa'
    | 'af'
    | 'am'
    | 'ar'
    | 'ar-EG'
    | 'de'
    | 'de-AT'
    | 'en'
    | 'en-GB'
    | 'en-US'
    | 'es'
    | 'es-419'
    | 'fr'
    | 'ja'
    | 'zh-Hans'
    // ...every other CLDR locale identifier
```

The generated file lists every language identifier and every regional variant
registered by CLDR, from bare language tags such as `'en'` to script- and
region-qualified tags such as `'zh-Hant-HK'` or `'ca-ES-valencia'`.

#### Basic Usage

```ts
import { type Locale } from './types/locales.js'

function formatCount(value: number, locale: Locale): string {
    return new Intl.NumberFormat(locale).format(value)
}

formatCount(1200, 'en-US')
formatCount(1200, 'es-419')
```

Because `Locale` only accepts identifiers CLDR actually defines, a typo such
as `'en-USA'` fails at compile time instead of silently reaching
`Intl.NumberFormat`.

#### Accepting Multiple Locales

`Intl` APIs commonly accept a locale or a list of locales in priority order.
`Locale[]` expresses that same option without widening to `string[]`.

```ts
import { type Locale } from './types/locales.js'

const preferredLocales: Locale[] = ['fr-CA', 'fr', 'en']
```

The runtime resolves the first supported locale from the list; `Locale[]`
only guarantees that every candidate is a real CLDR identifier.

#### Where It Is Used

`shared/application/loggers.ts` uses `Locale[]` for `Logger.datetimeLocales`,
the locale list passed to `Date.prototype.toLocaleString()` when formatting a
log timestamp. See `shared/application/loggers.md`.

> **Hint**
> `Locale` is a compile-time contract only. It does not validate that the
> runtime's ICU data actually supports every listed locale; `Intl` APIs fall
> back to a default when a requested locale is unsupported at runtime.
