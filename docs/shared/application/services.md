### Services

An application service is responsible for coordinating domain capabilities and
collaborators to fulfill a system purpose.
It defines the process of a use case, not the business meaning of the domain
objects involved in that use case.

The generated template provides `Service` as a semantic base class for these
processes.

#### Base Class

`Service` is an abstract class with no concrete behavior.

```ts title="shared/application/services.ts"
export abstract class Service {}
```

This design is intentional. The generated class marks the role of the object
without imposing an `execute()` method, a result shape, or a framework-specific
lifecycle.

#### First Service

In the following example we build a small registration process.

```ts title="users/application/register-user.ts"
import { Service } from '../../shared/application/services.js'
import { Email, NullableBoolean } from '../../shared/domain/value-objects.js'

type UserRecord = {
	id: string
	email: string
	active: boolean | null
}

type SaveUser = {
	save(user: UserRecord): Promise<UserRecord>
}

export class RegisterUser extends Service {
	public constructor(private readonly repository: SaveUser) {
		super()
	}

	public async execute(data: {
		id: string
		email: string
		active: boolean | null
	}): Promise<UserRecord> {
		const email = Email.from(data.email)
		const active = NullableBoolean.from(data.active)

		return this.repository.save({
			id: data.id,
			email: email.value,
			active: active.value,
		})
	}
}
```

The service coordinates the process. It validates the email, normalizes the
tri-state boolean, and delegates persistence to a collaborator.

The service does not own the email validation rule or the repository transport.
Those concerns remain in the value object and the adapter-facing collaborator.

#### Validation Failures

Now consider a process that wants to return an explicit result when the input
cannot be converted into domain objects.

```ts title="users/application/register-user.ts"
import { Service } from '../../shared/application/services.js'
import { Email } from '../../shared/domain/value-objects.js'
import { ValueError } from '../../shared/domain/errors.js'

type RegistrationResult =
	| { ok: true; email: string }
	| { ok: false; error: string }

export class RegisterUserSafely extends Service {
	public execute(email: string): RegistrationResult {
		try {
			return {
				ok: true,
				email: Email.from(email).value,
			}
		} catch (error: unknown) {
			if (error instanceof ValueError) {
				return {
					ok: false,
					error: error.message,
				}
			}

			throw error
		}
	}
}
```

`Email.from()` throws `ValueError` when the input is invalid. The service can
either allow that error to propagate or translate it into an application-level
result, depending on the requirements of the use case.

> **Warning**
> `Service` does not guarantee a method name or a result contract. If the codebase
> needs those conventions, establish them explicitly in project code instead of
> assuming the generated base class already provides them.

#### Example Flow

```mermaid
flowchart LR
    input[Input] --> service[Service]
    service --> domain["Domain capabilities"]
    domain --> collaborators[Collaborators]
    collaborators --> result[Result]
```

This flow keeps orchestration in the application layer and domain meaning in
the domain layer.
