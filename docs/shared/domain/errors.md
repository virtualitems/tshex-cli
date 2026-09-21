### Value Errors

`shared/domain/value-objects/errors.ts` defines `ValueError`, the error used by
generated value objects when an input does not satisfy their validation rule.

```ts
import { ValueError } from './shared/domain/value-objects/errors.ts'
import { Email } from './shared/domain/value-objects/strings.ts'

try {
    Email.from('not-an-email')
} catch (error) {
    if (error instanceof ValueError) {
        console.log(error.message)
        // Invalid value not-an-email for Email.
    }
}
```

`ValueError` receives the rejected value and the expected value-object name.
It does not include a validation code, a field name, or an HTTP status. Add
those details in the calling layer when the application requires them.
