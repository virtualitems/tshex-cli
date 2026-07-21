### JSON:API

`json-api.ts` declares a type-only implementation of the
[JSON:API v1.1](https://jsonapi.org/format/) specification, including the
[Atomic Operations extension](https://jsonapi.org/ext/atomic/). It gives an
adapter a shared vocabulary for request and response bodies without forcing a
particular server framework.

This module has no runtime code. It only describes compile-time structure;
rules that depend on runtime values, URI validity, document-wide uniqueness,
full linkage, HTTP semantics, or member-name character validation still
require explicit checks in the adapter.

#### Resource Identifiers

A resource is referenced in one of two ways, depending on whether the server
has assigned it a permanent id yet.

| Type | Option | Required members |
| --- | --- | --- |
| `JsonApiPersistedResourceIdentifier` | Server-assigned id | `type`, `id` |
| `JsonApiLocalResourceIdentifier` | Client-assigned local id, not yet persisted | `type`, `lid` |

`JsonApiResourceIdentifier` is the union of both.

```ts
import type { JsonApiResourceIdentifier } from '../../../shared/application/http/json-api.js'

const persisted: JsonApiResourceIdentifier<'users'> = { type: 'users', id: '1' }
const local: JsonApiResourceIdentifier<'users'> = { type: 'users', lid: 'tmp-1' }
```

Resource linkage (`JsonApiResourceLinkage`) is either a single identifier or
`null` (`JsonApiToOneLinkage`), or an array of identifiers
(`JsonApiToManyLinkage`).

#### Resource Objects

A resource object has the same persisted-versus-local split as its
identifier.

| Type | Option | `id` | `lid` |
| --- | --- | --- | --- |
| `JsonApiResourceObject` | Server-originated resource | required | optional |
| `JsonApiNewResourceObject` | Client-originated resource without a server id | never | optional |

`JsonApiCreateResourceObject` is the union accepted by create requests, since
a client is allowed to submit a client-generated id.

```ts title="users/adapters/get-user-handler.ts"
import { HttpRequestHandler } from '../../shared/application/http/handlers.js'
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

#### Relationships

`JsonApiRelationship` requires at least one of `links`, `data`, or `meta`, per
the base specification. Two narrower aliases fix the shape of `data`:

| Type | `data` shape |
| --- | --- |
| `JsonApiToOneRelationship` | single identifier or `null` |
| `JsonApiToManyRelationship` | array of identifiers |

```ts
import type {
    JsonApiToOneRelationship,
    JsonApiToManyRelationship,
} from '../../../shared/application/http/json-api.js'

const author: JsonApiToOneRelationship<{ type: 'authors' }> = {
    data: { type: 'authors', id: '9' },
}

const comments: JsonApiToManyRelationship<{ type: 'comments' }> = {
    data: [{ type: 'comments', id: '1' }, { type: 'comments', id: '2' }],
}
```

#### Documents

`JsonApiDocument` is a discriminated union over which top-level member is
required. Exactly one of these three shapes is valid at a time:

| Type | Required top-level member | Use |
| --- | --- | --- |
| `JsonApiDataDocument` | `data` | success responses returning resources |
| `JsonApiErrorDocument` | `errors` (non-empty) | failure responses |
| `JsonApiMetaDocument` | `meta` | responses with no primary data, such as a heartbeat |

`JsonApiDataDocument` itself is narrowed by four ready-made aliases depending
on what `data` contains:

| Alias | `data` shape |
| --- | --- |
| `JsonApiSingleResourceDocument` | resource or `null` |
| `JsonApiResourceCollectionDocument` | array of resources |
| `JsonApiSingleIdentifierDocument` | identifier or `null` |
| `JsonApiIdentifierCollectionDocument` | array of identifiers |
| `JsonApiRelationshipDocument` | any resource linkage |

```ts
import type {
    JsonApiErrorDocument,
    JsonApiMetaDocument,
} from '../../../shared/application/http/json-api.js'

const notFound: JsonApiErrorDocument = {
    errors: [{ status: '404', title: 'Not Found' }],
}

const heartbeat: JsonApiMetaDocument<{ status: string }> = {
    meta: { status: 'ok' },
}
```

#### Request Documents

Three request-only document shapes fix `data` to exactly what each operation
accepts:

| Type | `data` shape | Use |
| --- | --- | --- |
| `JsonApiCreateDocument` | `JsonApiCreateResourceObject` | `POST` requests |
| `JsonApiUpdateDocument` | `JsonApiResourceObject` | `PATCH` requests |
| `JsonApiRelationshipUpdateDocument` | resource linkage | relationship endpoints |

`JsonApiQueryParameters` describes the standard `include`, `sort`, `filter`,
and `page` query members, plus the `fields[TYPE]`, `filter[FIELD]`, and
`page[FIELD]` bracketed member-name patterns.

#### Errors

`JsonApiError` requires at least one of `id`, `links`, `status`, `code`,
`title`, `detail`, `source`, or `meta`.

```ts
import type { JsonApiError } from '../../../shared/application/http/json-api.js'

const validationError: JsonApiError = {
    status: '422',
    title: 'Invalid Attribute',
    detail: 'email must be a valid address',
    source: { pointer: '/data/attributes/email' },
}
```

#### Atomic Operations Extension

The Atomic Operations extension adds a request document that carries one or
more operations, and a response document that carries their results. Every
operation targets either a resource or a relationship, and every operation
uses exactly one of three op codes. `JsonApiAtomicStrictOperation` is the
union of the seven concrete shapes that combination produces:

| Type | `op` | Target | `data` |
| --- | --- | --- | --- |
| `JsonApiAtomicAddResourceOperation` | `'add'` | resource (`ref` optional, `href` optional) | resource to create |
| `JsonApiAtomicUpdateResourceOperation` | `'update'` | resource | resource to replace |
| `JsonApiAtomicRemoveResourceOperation` | `'remove'` | resource (required) | none |
| `JsonApiAtomicUpdateToOneRelationshipOperation` | `'update'` | relationship (required) | identifier or `null` |
| `JsonApiAtomicAddToManyRelationshipOperation` | `'add'` | relationship (required) | identifier array |
| `JsonApiAtomicUpdateToManyRelationshipOperation` | `'update'` | relationship (required) | identifier array |
| `JsonApiAtomicRemoveFromManyRelationshipOperation` | `'remove'` | relationship (required) | identifier array |

A target is expressed through `ref` (a `JsonApiAtomicResourceRef` or
`JsonApiAtomicRelationshipRef`) or through `href`, never both at once
(`JsonApiExclusive`).

```ts title="users/adapters/atomic-operations-handler.ts"
import {
    JsonApiAtomicOperationsDocument,
    JsonApiAtomicResultsDocument,
    JsonApiAtomicStrictOperation,
} from '../../shared/application/http/json-api.js'

const request: JsonApiAtomicOperationsDocument<JsonApiAtomicStrictOperation> = {
    'atomic:operations': [
        { op: 'add', href: '/users', data: { type: 'users', attributes: { email: 'ada@example.com' } } },
        { op: 'update', ref: { type: 'users', id: '1' }, data: { type: 'users', id: '1', attributes: { email: 'ada@lovelace.dev' } } },
        { op: 'remove', ref: { type: 'users', id: '2' } },
        { op: 'update', ref: { type: 'users', id: '1', relationship: 'team' }, data: { type: 'teams', id: '9' } },
        { op: 'add', ref: { type: 'teams', id: '9', relationship: 'members' }, data: [{ type: 'users', id: '1' }] },
    ],
}

const response: JsonApiAtomicResultsDocument = {
    'atomic:results': [{ data: { type: 'users', id: '1' } }, {}, {}, {}, {}],
}
```

`JsonApiAtomicRequestDocument` and `JsonApiAtomicResponseDocument` are the
named aliases for the request and response side of the extension; the latter
is a union of `JsonApiAtomicResultsDocument` and `JsonApiErrorDocument`, since
a batch of operations can still fail as a whole.

#### Extension And `@`-Members

`JsonApiExtensionMembers` and `JsonApiAtMembers` compose extension-namespaced
(`'ext:member'`) and meta (`'@member'`) properties through intersections, for
custom or third-party JSON:API extensions beyond Atomic Operations.

```ts
import type { JsonApiExtensionMembers, JsonApiResourceObject } from '../../../shared/application/http/json-api.js'

type VersionedResource = JsonApiResourceObject<'users'> &
    JsonApiExtensionMembers<'version', { id: string }>
```

> **Hint**
> These declarations only provide compile-time structure. Rules that depend on
> runtime values, URI validity, document-wide uniqueness, or member-name
> character validation still require explicit checks in the adapter.
