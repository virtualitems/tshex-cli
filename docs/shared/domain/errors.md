### Errors

Domain errors are responsible for making invalid domain values explicit.
They are used when a domain concept rejects an input because that input does not
satisfy the rule required by the concept.

The generated template provides `ValueError` for this purpose.

#### ValueError

`ValueError` is responsible for describing that a received value does not match
the expected domain concept.

```ts title="shared/domain/errors.ts"
export class ValueError extends Error {
    public constructor(received: string, expected: string) {
        super(`Invalid value ${received} for ${expected}.`)
    }
}
```

The constructor receives the invalid value and the expected concept name. The
message format is generated automatically.

#### First Usage

In the following example the `Email` value object uses `ValueError` to reject
strings that do not match the expected email format.

```ts title="shared/domain/value-objects.ts"
import { ValueError } from './errors.ts'

export class Email extends ValueObject<string> {
    // ...

    public static from(value: string): Email {
        if (this.isValid(value) === false) {
            throw new ValueError(value, this.name)
        }

        return new this(value)
    }
}
```

`Email.from()` throws `ValueError` when the received string does not satisfy
the email validation rule.

#### Handling The Error

Now consider a port that wants to translate a domain error into an
application-level result when creating a student from raw input.

```ts title="students/students.ts"
import { ValueError } from '../shared/domain/errors.ts'
import { Email } from '../shared/domain/value-objects.ts'
import { Student } from './domain/students.ts'

export class Roster {
    // ...

    public create(data: { name: string, email: string }): boolean {
        const { name, email } = data

        try {
            return this.service.create(new Student(name, Email.from(email)))
        } catch (error: unknown) {
            if (error instanceof ValueError) {
                this.logger.warn({ action: 'create', context: 'students', error: error.message })
                return false
            }

            throw error
        }
    }
}
```

This pattern keeps the domain rule strict while allowing the boundary layer to
decide how that failure is exposed.

> **Hint**
> `Email.from()` in the generated value objects uses this same error type.
> Reusing `ValueError` keeps invalid-value failures recognizable across the
> domain layer.

#### Next Step

The generated value objects that already throw `ValueError` are documented in
`value-objects.md`.
