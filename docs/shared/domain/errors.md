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

In the following example we define a local value object that rejects numbers
outside the accepted range.

```ts title="users/domain/percentage.ts"
import { ValueError } from '../../shared/domain/errors.js'

export class Percentage {
	public constructor(public readonly value: number) {}

	public static from(value: number): Percentage {
		if (value < 0 || value > 100) {
			throw new ValueError(String(value), Percentage.name)
		}

		return new Percentage(value)
	}
}
```

`Percentage.from()` throws `ValueError` when the received value does not satisfy
the rule of the concept.

#### Handling The Error

Now consider a process that wants to translate a domain error into an
application-level result.

```ts title="users/application/apply-discount.ts"
import { ValueError } from '../../shared/domain/errors.js'

type DiscountResult =
	| { ok: true; value: number }
	| { ok: false; error: string }

class Percentage {
	public constructor(public readonly value: number) {}

	public static from(value: number): Percentage {
		if (value < 0 || value > 100) {
			throw new ValueError(String(value), Percentage.name)
		}

		return new Percentage(value)
	}
}

export function applyDiscount(value: number): DiscountResult {
	try {
		return {
			ok: true,
			value: Percentage.from(value).value,
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
```

This pattern keeps the domain rule strict while allowing the application layer
to decide how that failure is exposed.

> **Hint**
> `Email.from()` in the generated value objects uses this same error type.
> Reusing `ValueError` keeps invalid-value failures recognizable across the
> domain layer.

#### Next Step

The generated value objects that already throw `ValueError` are documented in
`value-objects.md`.