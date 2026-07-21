import type { JsonObject, JsonPrimitive } from '../../../types/json'

/**
 * JSON:API v1.1 type definitions.
 *
 * Specification: https://jsonapi.org/format/
 * Official Atomic Operations extension: https://jsonapi.org/ext/atomic/
 *
 * These declarations provide compile-time structure only. Rules that depend on
 * runtime values, URI validity, document-wide uniqueness, full linkage, HTTP
 * semantics, or member-name character validation still require runtime checks.
 */

export type JsonApiId = string
export type JsonApiLocalId = string
export type JsonApiType = string
export type JsonApiUri = string
export type JsonApiMemberName = string

export type JsonApiNonEmptyArray<T> = readonly [T, ...T[]]

/** Converts a domain type into its readonly JSON-compatible representation. */
export type JsonApiJson<T> = T extends JsonPrimitive
    ? T
    : T extends (...args: never[]) => unknown
      ? never
      : T extends readonly (infer TItem)[]
        ? readonly JsonApiJson<TItem>[]
        : T extends object
          ? { readonly [TKey in keyof T]: JsonApiJson<T[TKey]> }
          : never

/** Requires one or more selected properties to be present. */
export type JsonApiRequireAtLeastOne<TObject, TKeys extends keyof TObject = keyof TObject> = Pick<
    TObject,
    Exclude<keyof TObject, TKeys>
> &
    {
        [TKey in TKeys]-?: Required<Pick<TObject, TKey>> &
            Partial<Pick<TObject, Exclude<TKeys, TKey>>>
    }[TKeys]

/** Permits zero or one of the selected properties. */
export type JsonApiAtMostOne<TObject, TKeys extends keyof TObject> = Pick<
    TObject,
    Exclude<keyof TObject, TKeys>
> &
    (
        | {
              [TKey in TKeys]-?: Required<Pick<TObject, TKey>> &
                  Partial<Record<Exclude<TKeys, TKey>, never>>
          }[TKeys]
        | Partial<Record<TKeys, never>>
    )

/** Requires exactly one of two object shapes. */
export type JsonApiExclusive<TLeft extends object, TRight extends object> =
    | (TLeft & { readonly [TKey in keyof TRight]?: never })
    | (TRight & { readonly [TKey in keyof TLeft]?: never })

/**
 * Extension and @-members are composable through intersections.
 *
 * Example:
 * type VersionedResource = JsonApiResourceObject &
 *     JsonApiExtensionMembers<'version', { id: string }>
 */
export type JsonApiExtensionMembers<TNamespace extends string, TMembers extends object> = {
    readonly [TKey in keyof TMembers as `${TNamespace}:${Extract<TKey, string>}`]: JsonApiJson<
        TMembers[TKey]
    >
}

export type JsonApiAtMembers<TMembers extends object> = {
    readonly [TKey in keyof TMembers as `@${Extract<TKey, string>}`]: JsonApiJson<TMembers[TKey]>
}

// -----------------------------------------------------------------------------
// Meta and links
// -----------------------------------------------------------------------------

export type JsonApiMeta = JsonObject
export type JsonApiAttributes = JsonObject

export type JsonApiLink = JsonApiUri | JsonApiLinkObject | null

export interface JsonApiLinkObject<TMeta extends object = JsonObject> {
    readonly href: JsonApiUri
    readonly rel?: string
    readonly describedby?: JsonApiLink
    readonly title?: string
    readonly type?: string
    readonly hreflang?: string | readonly string[]
    readonly meta?: JsonApiJson<TMeta>
}

export interface JsonApiPaginationLinks {
    readonly first?: JsonApiLink
    readonly last?: JsonApiLink
    readonly prev?: JsonApiLink
    readonly next?: JsonApiLink
}

export interface JsonApiTopLevelLinks extends JsonApiPaginationLinks {
    readonly self?: JsonApiLink
    readonly related?: JsonApiLink
    readonly describedby?: JsonApiLink
}

export interface JsonApiResourceLinks {
    readonly self?: JsonApiLink
}

export interface JsonApiRelationshipLinks extends JsonApiPaginationLinks {
    readonly self?: JsonApiLink
    readonly related?: JsonApiLink
}

export interface JsonApiErrorLinks {
    readonly about?: JsonApiLink
    readonly type?: JsonApiLink
}

// -----------------------------------------------------------------------------
// Resource identifiers and linkage
// -----------------------------------------------------------------------------

export interface JsonApiPersistedResourceIdentifier<
    TType extends JsonApiType = JsonApiType,
    TMeta extends object = JsonObject
> {
    readonly type: TType
    readonly id: JsonApiId
    readonly lid?: JsonApiLocalId
    readonly meta?: JsonApiJson<TMeta>
}

export interface JsonApiLocalResourceIdentifier<
    TType extends JsonApiType = JsonApiType,
    TMeta extends object = JsonObject
> {
    readonly type: TType
    readonly id?: never
    readonly lid: JsonApiLocalId
    readonly meta?: JsonApiJson<TMeta>
}

export type JsonApiResourceIdentifier<
    TType extends JsonApiType = JsonApiType,
    TMeta extends object = JsonObject
> = JsonApiPersistedResourceIdentifier<TType, TMeta> | JsonApiLocalResourceIdentifier<TType, TMeta>

export type JsonApiToOneLinkage<
    TIdentifier extends JsonApiResourceIdentifier = JsonApiResourceIdentifier
> = TIdentifier | null

export type JsonApiToManyLinkage<
    TIdentifier extends JsonApiResourceIdentifier = JsonApiResourceIdentifier
> = readonly TIdentifier[]

export type JsonApiResourceLinkage<
    TIdentifier extends JsonApiResourceIdentifier = JsonApiResourceIdentifier
> = JsonApiToOneLinkage<TIdentifier> | JsonApiToManyLinkage<TIdentifier>

// -----------------------------------------------------------------------------
// Relationships
// -----------------------------------------------------------------------------

export interface JsonApiRelationshipMembers<
    TData extends JsonApiResourceLinkage = JsonApiResourceLinkage,
    TMeta extends object = JsonObject
> {
    readonly links?: JsonApiRelationshipLinks
    readonly data?: TData
    readonly meta?: JsonApiJson<TMeta>
}

/** A base-spec relationship must contain links, data, or meta. */
export type JsonApiRelationship<
    TData extends JsonApiResourceLinkage = JsonApiResourceLinkage,
    TMeta extends object = JsonObject
> = JsonApiRequireAtLeastOne<JsonApiRelationshipMembers<TData, TMeta>, 'links' | 'data' | 'meta'>

export type JsonApiToOneRelationship<
    TIdentifier extends JsonApiResourceIdentifier = JsonApiResourceIdentifier,
    TMeta extends object = JsonObject
> = JsonApiRelationship<JsonApiToOneLinkage<TIdentifier>, TMeta>

export type JsonApiToManyRelationship<
    TIdentifier extends JsonApiResourceIdentifier = JsonApiResourceIdentifier,
    TMeta extends object = JsonObject
> = JsonApiRelationship<JsonApiToManyLinkage<TIdentifier>, TMeta>

export type JsonApiRelationships = Readonly<Record<JsonApiMemberName, JsonApiRelationship>>

/** Validates every property in a domain relationship map. */
export type JsonApiRelationshipMap<TRelationships extends object> = {
    readonly [TKey in keyof TRelationships]: TRelationships[TKey] extends JsonApiRelationship
        ? TRelationships[TKey]
        : never
}

// -----------------------------------------------------------------------------
// Resource objects
// -----------------------------------------------------------------------------

export interface JsonApiResourceFields<
    TAttributes extends object = JsonObject,
    TRelationships extends object = JsonApiRelationships,
    TMeta extends object = JsonObject
> {
    readonly attributes?: JsonApiJson<TAttributes>
    readonly relationships?: JsonApiRelationshipMap<TRelationships>
    readonly links?: JsonApiResourceLinks
    readonly meta?: JsonApiJson<TMeta>
}

/** A server-originated or otherwise persisted resource. */
export interface JsonApiResourceObject<
    TType extends JsonApiType = JsonApiType,
    TAttributes extends object = JsonObject,
    TRelationships extends object = JsonApiRelationships,
    TMeta extends object = JsonObject
> extends JsonApiResourceFields<TAttributes, TRelationships, TMeta> {
    readonly type: TType
    readonly id: JsonApiId
    readonly lid?: JsonApiLocalId
}

/** A client-originated resource that has not received a server id. */
export interface JsonApiNewResourceObject<
    TType extends JsonApiType = JsonApiType,
    TAttributes extends object = JsonObject,
    TRelationships extends object = JsonApiRelationships,
    TMeta extends object = JsonObject
> extends JsonApiResourceFields<TAttributes, TRelationships, TMeta> {
    readonly type: TType
    readonly id?: never
    readonly lid?: JsonApiLocalId
}

/** A resource accepted in create requests, including client-generated ids. */
export type JsonApiCreateResourceObject<
    TType extends JsonApiType = JsonApiType,
    TAttributes extends object = JsonObject,
    TRelationships extends object = JsonApiRelationships,
    TMeta extends object = JsonObject
> =
    | JsonApiResourceObject<TType, TAttributes, TRelationships, TMeta>
    | JsonApiNewResourceObject<TType, TAttributes, TRelationships, TMeta>

export type JsonApiAnyResourceObject = JsonApiCreateResourceObject

// -----------------------------------------------------------------------------
// JSON:API implementation object
// -----------------------------------------------------------------------------

export interface JsonApiObject<TMeta extends object = JsonObject> {
    readonly version?: string
    readonly ext?: readonly JsonApiUri[]
    readonly profile?: readonly JsonApiUri[]
    readonly meta?: JsonApiJson<TMeta>
}

// -----------------------------------------------------------------------------
// Errors
// -----------------------------------------------------------------------------

export interface JsonApiErrorSource {
    readonly pointer?: string
    readonly parameter?: string
    readonly header?: string
}

export interface JsonApiErrorMembers<TMeta extends object = JsonObject> {
    readonly id?: string
    readonly links?: JsonApiErrorLinks
    readonly status?: string
    readonly code?: string
    readonly title?: string
    readonly detail?: string
    readonly source?: JsonApiErrorSource
    readonly meta?: JsonApiJson<TMeta>
}

export type JsonApiError<TMeta extends object = JsonObject> = JsonApiRequireAtLeastOne<
    JsonApiErrorMembers<TMeta>
>

// -----------------------------------------------------------------------------
// Documents
// -----------------------------------------------------------------------------

export type JsonApiPrimaryData<
    TResource extends JsonApiResourceObject = JsonApiResourceObject,
    TIdentifier extends JsonApiResourceIdentifier = JsonApiResourceIdentifier
> = TResource | TIdentifier | null | readonly TResource[] | readonly TIdentifier[]

export interface JsonApiDocumentMembers<TMeta extends object = JsonObject> {
    readonly jsonapi?: JsonApiObject
    readonly links?: JsonApiTopLevelLinks
    readonly meta?: JsonApiJson<TMeta>
}

export interface JsonApiDataDocument<
    TData extends JsonApiPrimaryData = JsonApiPrimaryData,
    TIncluded extends JsonApiResourceObject = JsonApiResourceObject,
    TMeta extends object = JsonObject
> extends JsonApiDocumentMembers<TMeta> {
    readonly data: TData
    readonly errors?: never
    readonly included?: readonly TIncluded[]
}

export interface JsonApiErrorDocument<
    TError extends JsonApiError = JsonApiError,
    TMeta extends object = JsonObject
> extends JsonApiDocumentMembers<TMeta> {
    readonly data?: never
    readonly errors: JsonApiNonEmptyArray<TError>
    readonly included?: never
}

/** A valid document whose required top-level member is meta. */
export interface JsonApiMetaDocument<
    TMeta extends object = JsonObject
> extends JsonApiDocumentMembers<TMeta> {
    readonly data?: never
    readonly errors?: never
    readonly included?: never
    readonly meta: JsonApiJson<TMeta>
}

export type JsonApiDocument<
    TData extends JsonApiPrimaryData = JsonApiPrimaryData,
    TIncluded extends JsonApiResourceObject = JsonApiResourceObject,
    TError extends JsonApiError = JsonApiError,
    TMeta extends object = JsonObject
> =
    | JsonApiDataDocument<TData, TIncluded, TMeta>
    | JsonApiErrorDocument<TError, TMeta>
    | JsonApiMetaDocument<TMeta>

export type JsonApiSingleResourceDocument<
    TResource extends JsonApiResourceObject = JsonApiResourceObject,
    TIncluded extends JsonApiResourceObject = JsonApiResourceObject,
    TMeta extends object = JsonObject
> = JsonApiDataDocument<TResource | null, TIncluded, TMeta>

export type JsonApiResourceCollectionDocument<
    TResource extends JsonApiResourceObject = JsonApiResourceObject,
    TIncluded extends JsonApiResourceObject = JsonApiResourceObject,
    TMeta extends object = JsonObject
> = JsonApiDataDocument<readonly TResource[], TIncluded, TMeta>

export type JsonApiSingleIdentifierDocument<
    TIdentifier extends JsonApiResourceIdentifier = JsonApiResourceIdentifier,
    TMeta extends object = JsonObject
> = JsonApiDataDocument<TIdentifier | null, never, TMeta>

export type JsonApiIdentifierCollectionDocument<
    TIdentifier extends JsonApiResourceIdentifier = JsonApiResourceIdentifier,
    TMeta extends object = JsonObject
> = JsonApiDataDocument<readonly TIdentifier[], never, TMeta>

export type JsonApiRelationshipDocument<
    TLinkage extends JsonApiResourceLinkage = JsonApiResourceLinkage,
    TMeta extends object = JsonObject
> = JsonApiDataDocument<TLinkage, never, TMeta>

// -----------------------------------------------------------------------------
// Request documents
// -----------------------------------------------------------------------------

export interface JsonApiCreateDocument<
    TResource extends JsonApiCreateResourceObject = JsonApiCreateResourceObject,
    TMeta extends object = JsonObject
> extends JsonApiDocumentMembers<TMeta> {
    readonly data: TResource
    readonly errors?: never
    readonly included?: never
}

export interface JsonApiUpdateDocument<
    TResource extends JsonApiResourceObject = JsonApiResourceObject,
    TMeta extends object = JsonObject
> extends JsonApiDocumentMembers<TMeta> {
    readonly data: TResource
    readonly errors?: never
    readonly included?: never
}

export interface JsonApiRelationshipUpdateDocument<
    TLinkage extends JsonApiResourceLinkage = JsonApiResourceLinkage,
    TMeta extends object = JsonObject
> extends JsonApiDocumentMembers<TMeta> {
    readonly data: TLinkage
    readonly errors?: never
    readonly included?: never
}

// -----------------------------------------------------------------------------
// Query parameters
// -----------------------------------------------------------------------------

export interface JsonApiQueryParameters {
    readonly include?: string
    readonly sort?: string
    readonly filter?: string
    readonly page?: string
    readonly [name: `fields[${string}]`]: string | undefined
    readonly [name: `filter[${string}]`]: string | undefined
    readonly [name: `page[${string}]`]: string | undefined
}

// -----------------------------------------------------------------------------
// Official Atomic Operations extension
// -----------------------------------------------------------------------------

export type JsonApiAtomicExtensionUri = 'https://jsonapi.org/ext/atomic'

export type JsonApiAtomicOperationCode = 'add' | 'update' | 'remove'

export interface JsonApiAtomicPersistedResourceRef<TType extends JsonApiType = JsonApiType> {
    readonly type: TType
    readonly id: JsonApiId
    readonly lid?: never
    readonly relationship?: never
}

export interface JsonApiAtomicLocalResourceRef<TType extends JsonApiType = JsonApiType> {
    readonly type: TType
    readonly id?: never
    readonly lid: JsonApiLocalId
    readonly relationship?: never
}

export type JsonApiAtomicResourceRef<TType extends JsonApiType = JsonApiType> =
    JsonApiAtomicPersistedResourceRef<TType> | JsonApiAtomicLocalResourceRef<TType>

export interface JsonApiAtomicPersistedRelationshipRef<TType extends JsonApiType = JsonApiType> {
    readonly type: TType
    readonly id: JsonApiId
    readonly lid?: never
    readonly relationship: JsonApiMemberName
}

export interface JsonApiAtomicLocalRelationshipRef<TType extends JsonApiType = JsonApiType> {
    readonly type: TType
    readonly id?: never
    readonly lid: JsonApiLocalId
    readonly relationship: JsonApiMemberName
}

export type JsonApiAtomicRelationshipRef<TType extends JsonApiType = JsonApiType> =
    JsonApiAtomicPersistedRelationshipRef<TType> | JsonApiAtomicLocalRelationshipRef<TType>

export type JsonApiAtomicRef = JsonApiAtomicResourceRef | JsonApiAtomicRelationshipRef

export type JsonApiAtomicTarget<TRef extends JsonApiAtomicRef = JsonApiAtomicRef> =
    JsonApiExclusive<{ readonly ref: TRef }, { readonly href: JsonApiUri }>

export type JsonApiAtomicOptionalTarget<TRef extends JsonApiAtomicRef = JsonApiAtomicRef> =
    JsonApiAtomicTarget<TRef> | { readonly ref?: never; readonly href?: never }

export type JsonApiAtomicPrimaryData =
    | JsonApiAnyResourceObject
    | JsonApiResourceIdentifier
    | null
    | readonly JsonApiAnyResourceObject[]
    | readonly JsonApiResourceIdentifier[]

export interface JsonApiAtomicOperationMembers<
    TData = JsonApiAtomicPrimaryData,
    TMeta extends object = JsonObject
> {
    readonly op: JsonApiAtomicOperationCode
    readonly ref?: JsonApiAtomicRef
    readonly href?: JsonApiUri
    readonly data?: TData
    readonly meta?: JsonApiJson<TMeta>
}

/** Structural operation object from the extension's Document Structure section. */
export type JsonApiAtomicOperation<
    TData = JsonApiAtomicPrimaryData,
    TMeta extends object = JsonObject
> = JsonApiAtMostOne<JsonApiAtomicOperationMembers<TData, TMeta>, 'ref' | 'href'>

export type JsonApiAtomicAddResourceOperation<
    TResource extends JsonApiCreateResourceObject = JsonApiCreateResourceObject,
    TMeta extends object = JsonObject
> = {
    readonly op: 'add'
    readonly ref?: never
    readonly href?: JsonApiUri
    readonly data: TResource
    readonly meta?: JsonApiJson<TMeta>
}

export type JsonApiAtomicUpdateResourceOperation<
    TResource extends JsonApiResourceObject = JsonApiResourceObject,
    TMeta extends object = JsonObject
> = JsonApiAtomicOptionalTarget<JsonApiAtomicResourceRef> & {
    readonly op: 'update'
    readonly data: TResource
    readonly meta?: JsonApiJson<TMeta>
}

export type JsonApiAtomicRemoveResourceOperation<TMeta extends object = JsonObject> =
    JsonApiAtomicTarget<JsonApiAtomicResourceRef> & {
        readonly op: 'remove'
        readonly data?: never
        readonly meta?: JsonApiJson<TMeta>
    }

export type JsonApiAtomicUpdateToOneRelationshipOperation<
    TIdentifier extends JsonApiResourceIdentifier = JsonApiResourceIdentifier,
    TMeta extends object = JsonObject
> = JsonApiAtomicTarget<JsonApiAtomicRelationshipRef> & {
    readonly op: 'update'
    readonly data: JsonApiToOneLinkage<TIdentifier>
    readonly meta?: JsonApiJson<TMeta>
}

export type JsonApiAtomicAddToManyRelationshipOperation<
    TIdentifier extends JsonApiResourceIdentifier = JsonApiResourceIdentifier,
    TMeta extends object = JsonObject
> = JsonApiAtomicTarget<JsonApiAtomicRelationshipRef> & {
    readonly op: 'add'
    readonly data: JsonApiToManyLinkage<TIdentifier>
    readonly meta?: JsonApiJson<TMeta>
}

export type JsonApiAtomicUpdateToManyRelationshipOperation<
    TIdentifier extends JsonApiResourceIdentifier = JsonApiResourceIdentifier,
    TMeta extends object = JsonObject
> = JsonApiAtomicTarget<JsonApiAtomicRelationshipRef> & {
    readonly op: 'update'
    readonly data: JsonApiToManyLinkage<TIdentifier>
    readonly meta?: JsonApiJson<TMeta>
}

export type JsonApiAtomicRemoveFromManyRelationshipOperation<
    TIdentifier extends JsonApiResourceIdentifier = JsonApiResourceIdentifier,
    TMeta extends object = JsonObject
> = JsonApiAtomicTarget<JsonApiAtomicRelationshipRef> & {
    readonly op: 'remove'
    readonly data: JsonApiToManyLinkage<TIdentifier>
    readonly meta?: JsonApiJson<TMeta>
}

export type JsonApiAtomicStrictOperation =
    | JsonApiAtomicAddResourceOperation
    | JsonApiAtomicUpdateResourceOperation
    | JsonApiAtomicRemoveResourceOperation
    | JsonApiAtomicUpdateToOneRelationshipOperation
    | JsonApiAtomicAddToManyRelationshipOperation
    | JsonApiAtomicUpdateToManyRelationshipOperation
    | JsonApiAtomicRemoveFromManyRelationshipOperation

export interface JsonApiAtomicResult<
    TData extends JsonApiPrimaryData = JsonApiPrimaryData,
    TMeta extends object = JsonObject
> {
    readonly data?: TData
    readonly meta?: JsonApiJson<TMeta>
}

export interface JsonApiAtomicOperationsDocument<
    TOperation extends JsonApiAtomicOperation = JsonApiAtomicStrictOperation,
    TMeta extends object = JsonObject
> extends JsonApiDocumentMembers<TMeta> {
    readonly data?: never
    readonly errors?: never
    readonly included?: never
    readonly 'atomic:operations': JsonApiNonEmptyArray<TOperation>
    readonly 'atomic:results'?: never
}

export interface JsonApiAtomicResultsDocument<
    TResult extends JsonApiAtomicResult = JsonApiAtomicResult,
    TMeta extends object = JsonObject
> extends JsonApiDocumentMembers<TMeta> {
    readonly data?: never
    readonly errors?: never
    readonly included?: never
    readonly 'atomic:operations'?: never
    readonly 'atomic:results': JsonApiNonEmptyArray<TResult>
}

export type JsonApiAtomicRequestDocument<
    TOperation extends JsonApiAtomicOperation = JsonApiAtomicStrictOperation,
    TMeta extends object = JsonObject
> = JsonApiAtomicOperationsDocument<TOperation, TMeta>

export type JsonApiAtomicResponseDocument<
    TResult extends JsonApiAtomicResult = JsonApiAtomicResult,
    TError extends JsonApiError = JsonApiError,
    TMeta extends object = JsonObject
> = JsonApiAtomicResultsDocument<TResult, TMeta> | JsonApiErrorDocument<TError, TMeta>

export type JsonApiAtomicDocument<
    TOperation extends JsonApiAtomicOperation = JsonApiAtomicStrictOperation,
    TResult extends JsonApiAtomicResult = JsonApiAtomicResult,
    TError extends JsonApiError = JsonApiError,
    TMeta extends object = JsonObject
> =
    | JsonApiAtomicOperationsDocument<TOperation, TMeta>
    | JsonApiAtomicResultsDocument<TResult, TMeta>
    | JsonApiErrorDocument<TError, TMeta>
