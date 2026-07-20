### HTTP

The HTTP contracts define a framework-agnostic, transport-facing boundary.
They are used when an adapter needs to describe requests, responses, handlers,
or middleware in a consistent way.

The generated template relies on the standard `Request` and `Response` types
from the Fetch API, so adapters work directly with the platform's own APIs.

#### Response Body

`HttpResponseBody` is responsible for standardizing the shape of the response
payload.

```ts title="shared/application/http.ts"
export interface HttpResponseBody {
    readonly data: Record<string, unknown> | null
    readonly errors: string[] | null
    readonly links: Record<string, URL> | null
}
```

This structure makes successful data, error messages, and related links
explicit, leaving the router or server implementation as the adapter's
choice.

#### Request Handler

`HttpRequestHandler` is responsible for processing a request and returning a
response.

```ts title="shared/application/http.ts"
export interface HttpRequestHandler {
    handle(request: Request): Response | Promise<Response>
}
```

In the following example we implement a handler using the standard `Request`
and `Response` objects.

```ts title="users/adapters/get-user-handler.ts"
import {
    HttpRequestHandler,
    HttpResponseBody,
} from '../../shared/application/http.js'

export class GetUserHandler implements HttpRequestHandler {
    public handle(request: Request): Response {
        const id = new URL(request.url).pathname.split('/').at(-1)

        const body: HttpResponseBody = {
            data: { id },
            errors: null,
            links: null,
        }

        return Response.json(body, { status: 200 })
    }
}
```

Using the standard `Request` and `Response` types means the adapter relies
on the platform's own APIs, such as `request.url`, `request.headers`, and
`Response.json`.

#### Middleware

`HttpMiddleware` is responsible for running logic before or around the handler.

```ts title="shared/application/http.ts"
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
} from '../../shared/application/http.js'

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
cross-cutting behavior belongs in the generated HTTP abstraction.

> **Note**
> The shared HTTP contracts define the minimum boundary for adapters. Routing,
> serialization, and status code policies are the responsibility of the
> concrete transport.

#### Example Flow

```mermaid
flowchart LR
    request[Request] --> middleware[Middleware]
    middleware --> handler[Handler]
    handler --> response["Response body"]
```

This flow keeps the transport boundary explicit while leaving framework choices
to the adapter layer.
