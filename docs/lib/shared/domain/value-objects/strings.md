### `lib/shared/domain/value-objects/strings.ts`

`strings.ts` provides `Email`, a value object that validates and exposes an
email address.

#### Construct and inspect an email

```ts
const email = Email.from('ada@example.com')

email.username // 'ada'
email.domain // 'example.com'
email.tld // 'com'
```

`Email.from()` throws `ValueError` when its argument does not match the
generated expression. The expression validates the supplied string format; it
does not confirm that a mailbox or domain exists.
