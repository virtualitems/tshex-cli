### HTTP Errors

`HttpError` carries an HTTP status code alongside a matching message.
It is used when a use case or adapter needs to signal a specific HTTP outcome
without depending on a transport framework's own error type.

#### Declaration

```ts title="shared/application/http/errors.ts"
export class HttpError extends Error {
    public static readonly messages: { [code: number]: string } = Object.freeze({
        400: 'Bad Request',
        401: 'Unauthorized',
        404: 'Not Found',
        409: 'Conflict',
        // ...remaining standard 4xx/5xx status codes
        500: 'Internal Server Error',
    })

    public readonly code: number

    constructor(code: number, message?: string) {
        super(message ?? HttpError.messages[code] ?? 'Unknown Error')
        this.code = code
        this.name = 'HttpError'
    }
}
```

`HttpError.messages` maps every standard 4xx/5xx status code registered by the
HTTP specification, from `400` to `511`, to its reason phrase.

#### Implementation Options

Constructing an `HttpError` supports three distinct outcomes, depending on
what arguments are passed.

**1. Known code, default message.** The message is looked up from
`HttpError.messages`.

```ts
import { HttpError } from '../../shared/application/http/errors.js'

const error = new HttpError(404)

error.code // 404
error.message // 'Not Found'
```

**2. Known code, explicit message.** The explicit message always takes
precedence over the table.

```ts
import { HttpError } from '../../shared/application/http/errors.js'

const error = new HttpError(409, 'Email is already registered')

error.code // 409
error.message // 'Email is already registered'
```

**3. Unrecognized code, no message.** Codes outside `HttpError.messages` fall
back to `'Unknown Error'` instead of throwing.

```ts
import { HttpError } from '../../shared/application/http/errors.js'

const error = new HttpError(499)

error.code // 499
error.message // 'Unknown Error'
```

#### Usage In A Handler

```ts title="users/adapters/get-user-handler.ts"
import { HttpError } from '../../shared/application/http/errors.js'

function assertFound<T>(value: T | null): T {
    if (value === null) {
        throw new HttpError(404)
    }

    return value
}
```

`assertFound()` throws the standard `404` message for free. The caller of the
handler decides how a thrown `HttpError` is turned into a `Response`, since
`errors.ts` only declares the error shape and not the response translation.

> **Note**
> `HttpError` only carries the status code and message. Serializing it into a
> `Response` body, including it in a JSON:API error document (see
> `shared/application/http/json-api.md`), and logging it are the
> responsibility of the concrete adapter.
