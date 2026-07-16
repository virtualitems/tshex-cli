### HTTP

The HTTP contracts define a transport-facing boundary without coupling the
generated structure to a specific framework.
They are used when an adapter needs to describe requests, responses, handlers,
or middleware in a consistent way.

The generated template keeps `HttpRequest` and `HttpResponse` empty on purpose.
Each project can extend them with the fields required by its own transport.

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
explicit without forcing a specific router or server implementation.

#### Request Handler

`HttpRequestHandler` is responsible for processing a request and returning a
response.

```ts title="shared/application/http.ts"
export interface HttpRequestHandler {
    handle(request: HttpRequest): HttpResponse | Promise<HttpResponse>
}
```

In the following example we define adapter-specific request and response types,
then implement a handler.

```ts title="users/adapters/get-user-handler.ts"
import {
    HttpRequest,
    HttpRequestHandler,
    HttpResponse,
    HttpResponseBody,
} from '../../shared/application/http.js'

interface UserHttpRequest extends HttpRequest {
    readonly params: {
        id: string
    }
}

interface UserHttpResponse extends HttpResponse {
    readonly status: number
    readonly body: HttpResponseBody
}

export class GetUserHandler implements HttpRequestHandler {
    public handle(request: HttpRequest): HttpResponse {
        const typedRequest = request as UserHttpRequest

        return {
            status: 200,
            body: {
                data: {
                    id: typedRequest.params.id,
                },
                errors: null,
                links: null,
            },
        } as UserHttpResponse
    }
}
```

The generated `HttpRequest` and `HttpResponse` interfaces stay empty, so the
adapter declares the transport-specific fields locally. This keeps the shared
contract small and portable.

#### Middleware

`HttpMiddleware` is responsible for running logic before or around the handler.

```ts title="shared/application/http.ts"
export interface HttpMiddleware {
    process(
        request: HttpRequest,
        handler: HttpRequestHandler,
    ): HttpResponse | Promise<HttpResponse>
}
```

Now that the handler exists, middleware can wrap it.

```ts title="users/adapters/request-logger.ts"
import {
    HttpMiddleware,
    HttpRequest,
    HttpRequestHandler,
    HttpResponse,
} from '../../shared/application/http.js'

export class RequestLoggerMiddleware implements HttpMiddleware {
    public async process(
        request: HttpRequest,
        handler: HttpRequestHandler,
    ): Promise<HttpResponse> {
        void request
        return handler.handle(request)
    }
}
```

This middleware does not mutate the request or response. It only shows where
cross-cutting behavior belongs in the generated HTTP abstraction.

> **Warning**
> Do not treat the shared HTTP contracts as a full framework abstraction. They
> only define the minimum boundary for adapters. Routing, serialization, and
> status code policies remain the responsibility of the concrete transport.

#### Example Flow

```mermaid
flowchart LR
    request[Request] --> middleware[Middleware]
    middleware --> handler[Handler]
    handler --> response["Response body"]
```

This flow keeps the transport boundary explicit while leaving framework choices
to the adapter layer.
