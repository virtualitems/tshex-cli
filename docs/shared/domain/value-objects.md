### Value Objects

The library template places value-object code in
`shared/domain/value-objects/`. The directory separates the base class, the
generated string and Boolean values, and the error used for invalid values.

| File | Contents |
| --- | --- |
| `values.ts` | `ValueObject<T>` |
| `strings.ts` | `Email` |
| `booleans.ts` | `NullableBoolean` |
| `errors.ts` | `ValueError` |

#### Email

`Email.from()` validates an email string before it constructs an `Email` value.
It throws `ValueError` when the string does not match the generated expression.

```ts
import { Email } from './shared/domain/value-objects/strings.ts'

const email = Email.from('ada@example.com')

email.value
// 'ada@example.com'

email.username
// 'ada'

email.domain
// 'example.com'

email.tld
// 'com'
```

`Email.equals()` compares the wrapped addresses. Use `Email` when the domain
needs the validation rule and derived address parts in one type.

#### NullableBoolean

`NullableBoolean` represents `true`, `false`, or an indeterminate `null`
value.

```ts
import { NullableBoolean } from './shared/domain/value-objects/booleans.ts'

const consent = NullableBoolean.from(null)

consent.isIndeterminate()
// true
```

`NullableBoolean.from()` accepts a Boolean or `null`. `isIndeterminate()` is
true only when the wrapped value is `null`.

#### Custom Value

Extend `ValueObject<T>` when a domain value requires a representation and an
equality rule that belong together.

```ts
import { ValueObject } from './shared/domain/value-objects/values.ts'

class OrderNumber extends ValueObject<string> {
    public constructor(public readonly value: string) {
        super()
    }

    public equals(other: OrderNumber | null | undefined): boolean {
        return other !== null && other !== undefined && this.value === other.value
    }
}
```

`ValueObject.isValid()` returns false for `null`, `undefined`, and `NaN`.
Concrete values may override it when their validation needs stricter rules.
