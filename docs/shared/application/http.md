### HTTP

The HTTP contracts define a framework-agnostic, transport-facing boundary.
They are used when an adapter needs to describe requests, responses, handlers,
or middleware in a consistent way.

The generated template relies on the standard `Request` and `Response` types
from the Fetch API, so adapters work directly with the platform's own APIs.

The concern is split across four files under `shared/application/http/`:

1. `http.ts` for the request/response boundary contracts and `HttpError`;
2. `json-api.ts` for a type-only JSON:API v1.1 specification;
3. `json-web-token.ts` for a type-only JOSE/JWT specification;
4. `opengraph.ts` for a type-only Open Graph and social metadata specification.

Only `http.ts` contains runtime code. The other three files describe
compile-time structure for widely used formats so adapters do not have to
redefine them; they do not implement parsing, validation, or serialization.

#### Request Handler

`HttpRequestHandler` is responsible for processing a request and returning a
response.

```ts title="shared/application/http/http.ts"
export interface HttpRequestHandler {
    handle(request: Request): Response | Promise<Response>
}
```

In the following example we implement a handler using the standard `Request`
and `Response` objects.

```ts title="users/adapters/get-user-handler.ts"
import { HttpRequestHandler } from '../../shared/application/http/http.js'

export class GetUserHandler implements HttpRequestHandler {
    public handle(request: Request): Response {
        const id = new URL(request.url).pathname.split('/').at(-1)

        return Response.json({ data: { id } }, { status: 200 })
    }
}
```

Using the standard `Request` and `Response` types means the adapter relies
on the platform's own APIs, such as `request.url`, `request.headers`, and
`Response.json`. The shape of the JSON body itself, when the adapter follows
JSON:API, is described by the document types in `json-api.ts`.

#### Middleware

`HttpMiddleware` is responsible for running logic before or around the handler.

```ts title="shared/application/http/http.ts"
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
} from '../../shared/application/http/http.js'

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

#### HTTP Errors

`HttpError` is responsible for carrying an HTTP status code alongside a
matching message.

```ts title="shared/application/http/http.ts"
export class HttpError extends Error {
    public static readonly messages: { [code: number]: string } = Object.freeze({
        400: 'Bad Request',
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

`HttpError.messages` maps every standard 4xx/5xx status code to its reason
phrase. A caller can throw `new HttpError(404)` to get the standard message for
free, or pass an explicit `message` to override it. Codes outside the map fall
back to `'Unknown Error'`.

```ts title="users/adapters/get-user-handler.ts"
import { HttpError } from '../../shared/application/http/http.js'

function assertFound<T>(value: T | null): T {
    if (value === null) {
        throw new HttpError(404)
    }

    return value
}
```

> **Note**
> The shared HTTP contracts define the minimum boundary for adapters. Routing,
> serialization, and status code policies beyond `HttpError` are the
> responsibility of the concrete transport.

#### Example Flow

```mermaid
flowchart LR
    request[Request] --> middleware[Middleware]
    middleware --> handler[Handler]
    handler --> response["Response body"]
```

This flow keeps the transport boundary explicit while leaving framework choices
to the adapter layer.

#### JSON:API

`json-api.ts` declares a type-only implementation of the
[JSON:API v1.1](https://jsonapi.org/format/) specification, including the
[Atomic Operations extension](https://jsonapi.org/ext/atomic/). It gives an
adapter a shared vocabulary for request and response bodies without forcing a
particular server framework.

The main building blocks are:

- `JsonApiResourceObject` / `JsonApiResourceIdentifier` for resources and
  resource linkage, generic over the resource `type`, `attributes`, and
  `relationships`;
- `JsonApiRelationship`, `JsonApiToOneRelationship`, and
  `JsonApiToManyRelationship` for relationship objects;
- `JsonApiError` for the top-level error object;
- `JsonApiDocument` (and its narrower aliases such as
  `JsonApiSingleResourceDocument` and `JsonApiResourceCollectionDocument`) for
  the top-level document, discriminated between a data document, an error
  document, and a meta-only document;
- `JsonApiAtomicOperationsDocument` / `JsonApiAtomicResultsDocument` for the
  Atomic Operations extension request and response bodies.

```ts title="users/adapters/get-user-handler.ts"
import { HttpRequestHandler } from '../../shared/application/http/http.js'
import {
    JsonApiSingleResourceDocument,
    JsonApiResourceObject,
} from '../../shared/application/http/json-api.js'

type UserAttributes = { email: string }
type UserResource = JsonApiResourceObject<'users', UserAttributes>

export class GetUserHandler implements HttpRequestHandler {
    public handle(request: Request): Response {
        const id = new URL(request.url).pathname.split('/').at(-1) ?? ''

        const body: JsonApiSingleResourceDocument<UserResource> = {
            data: {
                type: 'users',
                id,
                attributes: { email: 'ada@example.com' },
            },
        }

        return Response.json(body, { status: 200 })
    }
}
```

> **Hint**
> These declarations only provide compile-time structure. Rules that depend on
> runtime values, URI validity, document-wide uniqueness, or member-name
> character validation still require explicit checks in the adapter.

#### JSON Web Tokens

`json-web-token.ts` declares a type-only implementation of the JOSE and JWT
family of RFCs (JWS, JWE, JWK, JWT, and related extensions such as DPoP and
selective disclosure). It lets an adapter describe tokens and keys precisely
without depending on a specific JOSE library's own types.

The main building blocks are:

- branded wire-format primitives such as `Base64Url`, `NumericDate`, and
  `CompactJwt`;
- `JsonWebKey` / `JsonWebKeySet` for keys, covering EC, RSA, `oct`, OKP, and
  ML-DSA (`AKP`) key types;
- `JwsHeader` / `JweHeader` for protected header parameters, and
  `JwsJsonSerialization` / `JweJsonSerialization` for the JSON serializations;
- `JwtClaims` (built on `IanaRegisteredJwtClaims`) for decoded payloads, plus
  ready-made profiles such as `OpenIdConnectIdTokenClaims`,
  `OAuth2JwtAccessTokenClaims`, `DpopProofClaims`, and `SdJwtClaims`;
- service contracts an adapter can implement against a concrete JOSE
  library: `JwtDecoder`, `JwsSigner`, `JwsVerifier`, `JweEncrypter`,
  `JweDecrypter`, `JwkThumbprinter`, and `JwksResolver`, plus
  `JwtValidationResult` for the outcome of validating a token against a
  `JwtValidationPolicy`.

```ts title="users/adapters/verify-access-token.ts"
import {
    JwsVerifier,
    OAuth2JwtAccessTokenClaims,
    CompactJws,
    JsonWebKey,
} from '../../shared/application/http/json-web-token.js'

export function verifyAccessToken(
    verifier: JwsVerifier,
    token: CompactJws,
    key: JsonWebKey,
) {
    return verifier.verify<OAuth2JwtAccessTokenClaims>(token, key)
}
```

> **Hint**
> This module has no runtime implementation. Pair it with a concrete JOSE
> library (for signing, encryption, or verification) and use these types to
> annotate its inputs and outputs.

#### Open Graph

`opengraph.ts` declares a type-only implementation of the
[Open Graph protocol](https://ogp.me/), the Twitter Card meta tags, and
Facebook's compatibility extensions. It is used when an adapter needs to build
or read the social-sharing metadata of a page.

The main building blocks are:

- `OpenGraphMetadata`, a union of every standard Open Graph object type
  (`OpenGraphWebsite`, `OpenGraphArticle`, `OpenGraphBook`, `OpenGraphProfile`,
  the `music.*` and `video.*` types, `OpenGraphPaymentLink`, and
  `OpenGraphCustomObject` for CURIE-style custom types);
- `OpenGraphMetaTag` and `TwitterMetaTag`, the flat `property`/`content` and
  `name`/`content` tag representations closer to the actual `<meta>` markup;
- `SocialMetadataDocument`, an aggregate of Open Graph, Twitter, Facebook, and
  standard head metadata for a single page, and `RawSocialMetadataDocument`
  for its rendered, tag-list form.

```ts title="users/adapters/user-profile-metadata.ts"
import { OpenGraphProfile } from '../../shared/application/http/opengraph.js'

export function buildProfileMetadata(username: string): OpenGraphProfile {
    return {
        type: 'profile',
        title: username,
        url: `https://example.com/users/${username}`,
        images: [{ url: `https://example.com/users/${username}/avatar.png` }],
        username,
    }
}
```

> **Hint**
> This module has no runtime implementation, including no HTML rendering. Use
> `OpenGraphMetadata` to build the data and a separate template or renderer to
> emit the `<meta>` tags described by `OpenGraphMetaTag`/`TwitterMetaTag`.
