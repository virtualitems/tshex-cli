### Validations

`Validatable` identifies an object that can report whether it is valid. The
contract does not define error messages, exception behavior, or asynchronous
validation.

```ts title="shared/application/validations.ts"
export interface Validatable {
    isValid(): boolean
}
```

The following input object validates its required name and delegates email
format validation to the generated value object.

```ts
import { Validatable } from '../../shared/application/validations.ts'
import { Email } from '../../shared/domain/value-objects/strings.ts'

class CreateUserInput implements Validatable {
    public constructor(
        public readonly name: string,
        public readonly email: string
    ) {}

    public isValid(): boolean {
        return this.name.trim() !== '' && Email.isValid(this.email)
    }
}

new CreateUserInput('Ada', 'ada@example.com').isValid()
// true
```

Use `Validatable` for a Boolean readiness check. Use a value object or a
separate error type when the caller needs to know why input is invalid.
