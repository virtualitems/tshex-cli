### `lib/types/locales.d.ts`

This module constrains locale values to the Unicode CLDR 48.2.1 identifiers
included in the template. The union applies at compile time. It does not
normalize locale strings or verify runtime locale support.

#### Current implementation

`locales.d.ts` contains the complete generated union. The following excerpt
shows its form; the source file contains every included identifier.

```ts
export type Locale =
    | 'aa'
    | 'aa-DJ'
    | 'aa-ER'
    | 'ab'
    | 'af'
    ...
```

#### Example

Use `Locale` to restrict a configuration or API field to one of the declared
locale identifiers.

```ts
const locale: Locale = 'es-CO'
```
