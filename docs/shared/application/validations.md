### Validations

Validation objects are responsible for checking whether application input is
ready for the next step of a process.
They are used to keep validation explicit before the application constructs
domain objects or invokes external collaborators.

The generated template provides a single contract for this purpose:
`Validatable`.

#### Contract

`Validatable` is responsible for exposing a Boolean validation result.

```ts title="shared/application/validations.ts"
export interface Validatable {
	isValid(): boolean
}
```

This contract stays deliberately small. It does not prescribe how errors are
stored, how messages are formatted, or whether validation is synchronous or
composed from several objects.

#### First Validation Object

In the following example we validate a registration payload before the service
turns it into domain values.

```ts title="users/application/create-user-input.ts"
import { Validatable } from '../../shared/application/validations.js'
import { Email } from '../../shared/domain/value-objects.js'

export class CreateUserInput implements Validatable {
	public constructor(
		public readonly id: string,
		public readonly email: string,
	) {}

	public isValid(): boolean {
		return this.id.length > 0 && Email.isValid(this.email)
	}
}
```

`CreateUserInput` performs application-level checks without constructing an
`Email` instance yet. This is useful when the process wants to reject invalid
input before attempting a full domain conversion.

#### Integration With A Service

Now that the validation object exists, a service can decide what to do when the
input does not satisfy the contract.

```ts title="users/application/register-user.ts"
import { Service } from '../../shared/application/services.js'
import { Validatable } from '../../shared/application/validations.js'

type CreateUserInput = Validatable & {
	readonly id: string
	readonly email: string
}

type RegistrationResult =
	| { ok: true }
	| { ok: false; errors: string[] }

export class RegisterUser extends Service {
	public execute(input: CreateUserInput): RegistrationResult {
		if (input.isValid() === false) {
			return {
				ok: false,
				errors: ['The registration input is invalid.'],
			}
		}

		return {
			ok: true,
		}
	}
}
```

The service decides the process outcome, while the validation object owns the
question of whether the input is acceptable.

> **Hint**
> `Validatable` does not replace domain rules. Use it for application-level
> checks. Keep domain invariants inside value objects, entities, or aggregates.

#### Next Step

After validation succeeds, the next step is usually to construct domain objects
or call a repository through an application service.