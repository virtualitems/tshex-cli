### `lib/types/locales.d.ts`

`locales.d.ts` declares `Locale` as the Unicode CLDR 48.2.1 locale identifier
union included in the template.

#### Constrain locale fields

Use `Locale` to restrict a configuration or API field to one of the declared
locale identifiers.

```ts
const locale: Locale = 'es-CO'
```

#### Source and runtime support

The union reflects the generated CLDR version. It does not check the user's
runtime locale support or normalize locale strings.
