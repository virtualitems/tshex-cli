### HTTP Handlers

The handler contracts define a framework-agnostic, transport-facing boundary.
They are used when an adapter needs to describe request processing and
cross-cutting request logic in a consistent way, without depending on a
specific server framework.

The generated template relies on the standard `Request` and `Response` types
from the Fetch API, so adapters work directly with the platform's own APIs.

#### Request Handler

`HttpRequestHandler` is responsible for processing a request and returning a
response.

```ts title="shared/application/http/handlers.ts"
export interface HttpRequestHandler {
    handle(request: Request): Response | Promise<Response>
}
```

In the following example we implement a handler using the standard `Request`
and `Response` objects.

```ts title="users/adapters/get-user-handler.ts"
import { HttpRequestHandler } from '../../shared/application/http/handlers.js'

export class GetUserHandler implements HttpRequestHandler {
    public handle(request: Request): Response {
        const id = new URL(request.url).pathname.split('/').at(-1)

        return Response.json({ data: { id } }, { status: 200 })
    }
}
```

Using the standard `Request` and `Response` types means the adapter relies on
the platform's own APIs, such as `request.url`, `request.headers`, and
`Response.json`. The shape of the JSON body itself, when the adapter follows
JSON:API, is described by the document types in
`shared/application/http/json-api.md`.

`handle()` can be synchronous or asynchronous; both `Response` and
`Promise<Response>` are valid return types, so an adapter that awaits a
database call satisfies the same contract as one that returns immediately.

#### Middleware

`HttpMiddleware` is responsible for running logic before or around the
handler.

```ts title="shared/application/http/handlers.ts"
export interface HttpMiddleware {
    process(
        request: Request,
        handler: HttpRequestHandler,
    ): Response | Promise<Response>
}
```

Now that the handler exists, middleware can wrap it.

```ts title="users/adapters/request-logger.ts"
import {
    HttpMiddleware,
    HttpRequestHandler,
} from '../../shared/application/http/handlers.js'

export class RequestLoggerMiddleware implements HttpMiddleware {
    public async process(
        request: Request,
        handler: HttpRequestHandler,
    ): Promise<Response> {
        void request
        return handler.handle(request)
    }
}
```

This middleware passes the request through unchanged, showing where
cross-cutting behavior belongs in the generated HTTP abstraction. A
short-circuiting middleware, such as an authentication guard, follows the same
shape but returns a `Response` (for example built from
`shared/application/http/errors.md`'s `HttpError`) without calling
`handler.handle()`.

> **Note**
> The handler contracts define the minimum boundary for adapters. Routing,
> middleware chaining/composition, and status code policies beyond
> `HttpError` are the responsibility of the concrete transport.

#### Example Flow

```mermaid
flowchart LR
    request[Request] --> middleware[Middleware]
    middleware --> handler[Handler]
    handler --> response["Response body"]
```

This flow keeps the transport boundary explicit while leaving framework
choices to the adapter layer.
