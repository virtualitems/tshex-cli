import type { JsonObject, JsonValue } from '../../../types/json'
import type { Generic } from '../../../types/objects'

/**
 * @see
 * - RFC 7515: JSON Web Signature (JWS)
 * - RFC 7516: JSON Web Encryption (JWE)
 * - RFC 7517: JSON Web Key (JWK)
 * - RFC 7518: JSON Web Algorithms (JWA)
 * - RFC 7519: JSON Web Token (JWT)
 * - RFC 7638: JWK Thumbprint
 * - RFC 7797: JWS Unencoded Payload Option
 * - RFC 7800: Proof-of-Possession Key Semantics
 * - RFC 8037: CFRG Curves for JOSE
 * - RFC 8725: JWT Best Current Practices
 * - RFC 8812: secp256k1 for JOSE
 * - RFC 9068: JWT Profile for OAuth 2.0 Access Tokens
 * - RFC 9278: JWK Thumbprint URI
 * - RFC 9396: Rich Authorization Requests
 * - RFC 9449: DPoP
 * - RFC 9864: Fully-Specified Algorithms for JOSE and COSE
 * - RFC 9901: Selective Disclosure for JWTs
 * - RFC 9964: ML-DSA for JOSE and COSE
 *
 * Registry coverage:
 * - IANA JOSE registries, updated 2026-05-22
 * - IANA JWT registries, updated 2026-07-20
 */

/* -------------------------------------------------------------------------- */
/* JSON primitives and branded wire values                                    */
/* -------------------------------------------------------------------------- */

export type Base64Url = string & {
    readonly __base64UrlBrand: unique symbol
}

export type Base64 = string & {
    readonly __base64Brand: unique symbol
}

export type NumericDate = number & {
    readonly __numericDateBrand: unique symbol
}

export type StringOrURI = string & {
    readonly __stringOrUriBrand: unique symbol
}

export type UriString = string & {
    readonly __uriBrand: unique symbol
}

export type MediaType = string & {
    readonly __mediaTypeBrand: unique symbol
}

export type KeyId = string & {
    readonly __keyIdBrand: unique symbol
}

export type BinaryData = ArrayBuffer | Uint8Array

/* -------------------------------------------------------------------------- */
/* IANA JOSE algorithm registry                                               */
/* -------------------------------------------------------------------------- */

/** Algorithms used by the JWS "alg" protected-header parameter. */
export type JwsAlgorithm =
    | 'HS256'
    | 'HS384'
    | 'HS512'
    | 'RS256'
    | 'RS384'
    | 'RS512'
    | 'ES256'
    | 'ES384'
    | 'ES512'
    | 'PS256'
    | 'PS384'
    | 'PS512'
    | 'none'
    | 'EdDSA'
    | 'ES256K'
    | 'ML-DSA-44'
    | 'ML-DSA-65'
    | 'ML-DSA-87'
    | 'Ed25519'
    | 'Ed448'

/** Fully-specified signature identifiers. */
export type FullySpecifiedJwsAlgorithm = Exclude<JwsAlgorithm, 'EdDSA'> | 'Ed25519' | 'Ed448'

/** Polymorphic identifier deprecated by RFC 9864. */
export type DeprecatedJwsAlgorithm = 'EdDSA'

/** Algorithms used by the JWE "alg" key-management parameter. */
export type JweKeyManagementAlgorithm =
    | 'RSA1_5'
    | 'RSA-OAEP'
    | 'RSA-OAEP-256'
    | 'RSA-OAEP-384'
    | 'RSA-OAEP-512'
    | 'A128KW'
    | 'A192KW'
    | 'A256KW'
    | 'dir'
    | 'ECDH-ES'
    | 'ECDH-ES+A128KW'
    | 'ECDH-ES+A192KW'
    | 'ECDH-ES+A256KW'
    | 'A128GCMKW'
    | 'A192GCMKW'
    | 'A256GCMKW'
    | 'PBES2-HS256+A128KW'
    | 'PBES2-HS384+A192KW'
    | 'PBES2-HS512+A256KW'

/** Algorithms used by the JWE "enc" content-encryption parameter. */
export type JweContentEncryptionAlgorithm =
    'A128CBC-HS256' | 'A192CBC-HS384' | 'A256CBC-HS512' | 'A128GCM' | 'A192GCM' | 'A256GCM'

/** Identifiers registered only for use as JWK "alg" values. */
export type JwkOnlyAlgorithm =
    'RS1' | 'A128CBC' | 'A192CBC' | 'A256CBC' | 'A128CTR' | 'A192CTR' | 'A256CTR' | 'HS1'

export type ProhibitedJwkAlgorithm = JwkOnlyAlgorithm

export type JoseAlgorithm =
    JwsAlgorithm | JweKeyManagementAlgorithm | JweContentEncryptionAlgorithm | JwkOnlyAlgorithm

export type JweCompressionAlgorithm = 'DEF'

export type HashAlgorithm = 'sha-256' | 'sha-384' | 'sha-512' | (string & {})

/* -------------------------------------------------------------------------- */
/* JSON Web Key                                                               */
/* -------------------------------------------------------------------------- */

export type JwkKeyType = 'EC' | 'RSA' | 'oct' | 'OKP' | 'AKP'

export type EcCurve = 'P-256' | 'P-384' | 'P-521' | 'secp256k1'

export type OkpCurve = 'Ed25519' | 'Ed448' | 'X25519' | 'X448'

export type MldsaAlgorithm = 'ML-DSA-44' | 'ML-DSA-65' | 'ML-DSA-87'

export type JwkUse = 'sig' | 'enc'

export type JwkOperation =
    'sign' | 'verify' | 'encrypt' | 'decrypt' | 'wrapKey' | 'unwrapKey' | 'deriveKey' | 'deriveBits'

export type JwkRevocationProperties = Generic<JsonValue> & {
    revoked_at?: NumericDate
    reason?: string
}

export interface JwkCommonParameters {
    /** Key type. */
    kty: JwkKeyType
    /** Intended public-key use. */
    use?: JwkUse
    /** Permitted operations. */
    key_ops?: JwkOperation[]
    /** Intended algorithm. */
    alg?: JoseAlgorithm
    /** Key identifier. */
    kid?: KeyId | string
    /** URL for an X.509 certificate or certificate chain. */
    x5u?: UriString | string
    /** Base64-encoded DER X.509 certificate chain. */
    x5c?: Base64[]
    /** SHA-1 X.509 certificate thumbprint. */
    x5t?: Base64Url
    /** SHA-256 X.509 certificate thumbprint. */
    'x5t#S256'?: Base64Url
    /** WebCrypto extractability flag registered for JWK use. */
    ext?: boolean
    /** Key issue time registered by OpenID Federation. */
    iat?: NumericDate
    /** Key activation time registered by OpenID Federation. */
    nbf?: NumericDate
    /** Key expiration time registered by OpenID Federation. */
    exp?: NumericDate
    /** Revocation properties registered by OpenID Federation. */
    revoked?: JwkRevocationProperties | boolean
}

export interface EcPublicJwk extends JwkCommonParameters {
    kty: 'EC'
    crv: EcCurve
    x: Base64Url
    y: Base64Url
    d?: never
}

export interface EcPrivateJwk extends JwkCommonParameters {
    kty: 'EC'
    crv: EcCurve
    x: Base64Url
    y: Base64Url
    d: Base64Url
}

export interface RsaOtherPrimeInfo {
    r: Base64Url
    d: Base64Url
    t: Base64Url
}

export interface RsaPublicJwk extends JwkCommonParameters {
    kty: 'RSA'
    n: Base64Url
    e: Base64Url
    d?: never
    p?: never
    q?: never
    dp?: never
    dq?: never
    qi?: never
    oth?: never
}

export interface RsaPrivateJwk extends JwkCommonParameters {
    kty: 'RSA'
    n: Base64Url
    e: Base64Url
    d: Base64Url
    p?: Base64Url
    q?: Base64Url
    dp?: Base64Url
    dq?: Base64Url
    qi?: Base64Url
    oth?: RsaOtherPrimeInfo[]
}

export interface OctJwk extends JwkCommonParameters {
    kty: 'oct'
    k: Base64Url
}

export interface OkpPublicJwk extends JwkCommonParameters {
    kty: 'OKP'
    crv: OkpCurve
    x: Base64Url
    d?: never
}

export interface OkpPrivateJwk extends JwkCommonParameters {
    kty: 'OKP'
    crv: OkpCurve
    x: Base64Url
    d: Base64Url
}

export interface AkpPublicJwk extends JwkCommonParameters {
    kty: 'AKP'
    alg: MldsaAlgorithm
    pub: Base64Url
    priv?: never
}

export interface AkpPrivateJwk extends JwkCommonParameters {
    kty: 'AKP'
    alg: MldsaAlgorithm
    pub: Base64Url
    priv: Base64Url
}

export type PublicJwk = EcPublicJwk | RsaPublicJwk | OkpPublicJwk | AkpPublicJwk

export type PrivateJwk = EcPrivateJwk | RsaPrivateJwk | OctJwk | OkpPrivateJwk | AkpPrivateJwk

export type JsonWebKey = PublicJwk | PrivateJwk

export interface JsonWebKeySet {
    keys: JsonWebKey[]
}

export type PublicJsonWebKeySet = {
    keys: PublicJwk[]
}

export type JwkThumbprint = Base64Url

export type JwkThumbprintUri = `urn:ietf:params:oauth:jwk-thumbprint:${string}:${string}`

/* -------------------------------------------------------------------------- */
/* JOSE header parameters                                                     */
/* -------------------------------------------------------------------------- */

export interface JoseCommonHeaderParameters {
    /** URL for the JWK Set containing the key used to secure the object. */
    jku?: UriString | string
    /** Public key used to secure the object. */
    jwk?: PublicJwk
    /** Key identifier. */
    kid?: KeyId | string
    /** URL for an X.509 certificate or certificate chain. */
    x5u?: UriString | string
    /** Base64-encoded DER X.509 certificate chain. */
    x5c?: Base64[]
    /** SHA-1 certificate thumbprint. */
    x5t?: Base64Url
    /** SHA-256 certificate thumbprint. */
    'x5t#S256'?: Base64Url
    /** Type of the complete JOSE object, commonly "JWT". */
    typ?: MediaType | string
    /** Media type of the secured payload, commonly "JWT" for nesting. */
    cty?: MediaType | string
    /** Header parameters that must be understood and processed. */
    crit?: string[]
}

export interface JwsHeaderParameters extends JoseCommonHeaderParameters {
    alg: JwsAlgorithm
    /** RFC 7797: whether the payload is base64url encoded. Defaults to true. */
    b64?: boolean
    /** PASSporT extension identifier. */
    ppt?: string
    /** ACME URL header parameter. */
    url?: UriString | string
    /** Nonce registered for JWS/JWE use. */
    nonce?: string
    /** Signature Validation Token. */
    svt?: string
    /** Header containing a JWT. */
    jwt?: CompactJwt
    /** OAuth Client Identifier. */
    client_id?: string
    /** OpenID Federation trust chain. */
    trust_chain?: CompactJwt[]
    /** OpenID Federation peer trust chain. */
    peer_trust_chain?: CompactJwt[]
}

export interface JweHeaderParameters extends JoseCommonHeaderParameters {
    alg: JweKeyManagementAlgorithm
    enc: JweContentEncryptionAlgorithm
    zip?: JweCompressionAlgorithm
    epk?: PublicJwk
    apu?: Base64Url
    apv?: Base64Url
    /** AES-GCM key-wrap initialization vector. */
    iv?: Base64Url
    /** AES-GCM key-wrap authentication tag. */
    tag?: Base64Url
    p2s?: Base64Url
    p2c?: number
    /** Replicated JWT issuer claim for encrypted JWTs. */
    iss?: StringOrURI | string
    /** Replicated JWT subject claim for encrypted JWTs. */
    sub?: StringOrURI | string
    /** Replicated JWT audience claim for encrypted JWTs. */
    aud?: StringOrURI | string | Array<StringOrURI | string>
    /** ACME URL header parameter. */
    url?: UriString | string
    /** Nonce registered for JWS/JWE use. */
    nonce?: string
}

export type JwsHeader<CustomHeader extends object = Record<never, never>> = JwsHeaderParameters &
    CustomHeader

export type JweHeader<CustomHeader extends object = Record<never, never>> = JweHeaderParameters &
    CustomHeader

export type JoseHeader = JwsHeaderParameters | JweHeaderParameters

/* -------------------------------------------------------------------------- */
/* JWS serializations                                                         */
/* -------------------------------------------------------------------------- */

export type CompactJws = `${string}.${string}.${string}` & {
    readonly __compactJwsBrand: unique symbol
}

export type UnsecuredCompactJws = `${string}.${string}.` & {
    readonly __unsecuredCompactJwsBrand: unique symbol
}

export interface JwsSignature<Header extends JwsHeaderParameters = JwsHeaderParameters> {
    protected?: Base64Url
    header?: Partial<Header>
    signature: Base64Url
}

export interface GeneralJwsJsonSerialization<
    Header extends JwsHeaderParameters = JwsHeaderParameters,
    Payload extends string = Base64Url
> {
    payload: Payload
    signatures: Array<JwsSignature<Header>>
}

export interface FlattenedJwsJsonSerialization<
    Header extends JwsHeaderParameters = JwsHeaderParameters,
    Payload extends string = Base64Url
> extends JwsSignature<Header> {
    payload: Payload
}

export interface DetachedJwsSignature<Header extends JwsHeaderParameters = JwsHeaderParameters> {
    protected?: Base64Url
    header?: Partial<Header>
    signature: Base64Url
    payload?: never
}

export type JwsJsonSerialization<
    Header extends JwsHeaderParameters = JwsHeaderParameters,
    Payload extends string = Base64Url
> = GeneralJwsJsonSerialization<Header, Payload> | FlattenedJwsJsonSerialization<Header, Payload>

/* -------------------------------------------------------------------------- */
/* JWE serializations                                                         */
/* -------------------------------------------------------------------------- */

export type CompactJwe = `${string}.${string}.${string}.${string}.${string}` & {
    readonly __compactJweBrand: unique symbol
}

export interface JweRecipient<Header extends JweHeaderParameters = JweHeaderParameters> {
    header?: Partial<Header>
    encrypted_key: Base64Url
}

export interface JweJsonSharedMembers<Header extends JweHeaderParameters = JweHeaderParameters> {
    protected?: Base64Url
    unprotected?: Partial<Header>
    aad?: Base64Url
    iv: Base64Url
    ciphertext: Base64Url
    tag: Base64Url
}

export interface GeneralJweJsonSerialization<
    Header extends JweHeaderParameters = JweHeaderParameters
> extends JweJsonSharedMembers<Header> {
    recipients: Array<JweRecipient<Header>>
}

export interface FlattenedJweJsonSerialization<
    Header extends JweHeaderParameters = JweHeaderParameters
>
    extends JweJsonSharedMembers<Header>, JweRecipient<Header> {
    recipients?: never
}

export type JweJsonSerialization<Header extends JweHeaderParameters = JweHeaderParameters> =
    GeneralJweJsonSerialization<Header> | FlattenedJweJsonSerialization<Header>

/* -------------------------------------------------------------------------- */
/* JWT claims                                                                 */
/* -------------------------------------------------------------------------- */

export type JwtAudience = StringOrURI | string | Array<StringOrURI | string>

/** The seven registered claim names defined directly by RFC 7519. */
export interface JwtRegisteredClaims {
    /** Issuer. */
    iss?: StringOrURI | string
    /** Subject. */
    sub?: StringOrURI | string
    /** Audience. */
    aud?: JwtAudience
    /** Expiration time. */
    exp?: NumericDate
    /** Not-before time. */
    nbf?: NumericDate
    /** Issued-at time. */
    iat?: NumericDate
    /** JWT identifier. */
    jti?: string
}

export interface OidcAddressClaim {
    formatted?: string
    street_address?: string
    locality?: string
    region?: string
    postal_code?: string
    country?: string
}

export type JwtActorClaim = Generic<JsonValue> & {
    iss?: StringOrURI | string
    sub?: StringOrURI | string
}

export type JwtConfirmationClaim = Generic<JsonValue> & {
    jwk?: PublicJwk
    jwe?: CompactJwe
    kid?: KeyId | string
    jku?: UriString | string
    'x5t#S256'?: Base64Url
    osc?: JsonObject
    jkt?: JwkThumbprint
}

export type AuthorizationDetail = Generic<JsonValue> & {
    type: string
    locations?: Array<UriString | string>
    actions?: string[]
    datatypes?: string[]
    identifier?: string
    privileges?: string[]
}

export interface DistributedClaimSource {
    endpoint?: UriString | string
    access_token?: string
    JWT?: CompactJwt
}

export interface AggregatedClaimSource {
    JWT: CompactJwt
}

export type ClaimSource = DistributedClaimSource | AggregatedClaimSource

export type JwtStatusReference = Generic<JsonValue> & {
    status_list?: JsonObject
}

/**
 * Every currently registered IANA JWT claim name is represented here.
 * Reusable claims have concrete types. Domain-specific claims remain JsonValue.
 */
export interface IanaRegisteredJwtClaims extends JwtRegisteredClaims {
    name?: string
    given_name?: string
    family_name?: string
    middle_name?: string
    nickname?: string
    preferred_username?: string
    profile?: UriString | string
    picture?: UriString | string
    website?: UriString | string
    email?: string
    email_verified?: boolean
    gender?: string
    birthdate?: string
    zoneinfo?: string
    locale?: string
    phone_number?: string
    phone_number_verified?: boolean
    address?: OidcAddressClaim
    updated_at?: NumericDate
    azp?: string
    nonce?: string
    auth_time?: NumericDate
    at_hash?: Base64Url
    c_hash?: Base64Url
    acr?: StringOrURI | string
    amr?: string[]
    sub_jwk?: PublicJwk
    cnf?: JwtConfirmationClaim

    sip_from_tag?: string
    sip_date?: string
    sip_callid?: string
    sip_cseq_num?: number
    sip_via_branch?: string
    orig?: JsonValue
    dest?: JsonValue
    mky?: JsonValue
    events?: JsonObject
    toe?: NumericDate
    txn?: string
    rph?: JsonValue
    sid?: string
    vot?: string
    vtm?: UriString | string
    attest?: string
    origid?: string
    act?: JwtActorClaim
    scope?: string | string[]
    client_id?: string
    may_act?: JwtActorClaim
    jcard?: JsonValue
    at_use_nbr?: number
    div?: JsonValue
    opt?: JsonValue
    vc?: JsonObject
    vp?: JsonObject
    sph?: string
    ace_profile?: StringOrURI | string
    cnonce?: Base64Url | string
    exi?: number
    roles?: string[]
    groups?: string[]
    entitlements?: string[]
    token_introspection?: JsonObject

    eat_nonce?: Base64Url | Base64Url[]
    ueid?: Base64Url
    sueids?: Base64Url[]
    oemid?: JsonValue
    hwmodel?: JsonValue
    hwversion?: JsonValue
    oemboot?: boolean
    dbgstat?: JsonValue
    location?: JsonValue
    eat_profile?: StringOrURI | string
    submods?: JsonObject
    uptime?: number
    bootcount?: number
    bootseed?: Base64Url
    dloas?: JsonValue
    swname?: string
    swversion?: string
    manifests?: JsonValue
    measurements?: JsonValue
    measres?: JsonValue
    intuse?: JsonValue

    cdniv?: number
    cdnicrit?: string[]
    cdniip?: string
    cdniuc?: JsonObject
    cdniets?: number
    cdnistt?: number
    cdnistd?: number
    sig_val_claims?: JsonObject

    authorization_details?: AuthorizationDetail[]
    verified_claims?: JsonObject
    place_of_birth?: JsonObject
    nationalities?: string[]
    birth_family_name?: string
    birth_given_name?: string
    birth_middle_name?: string
    salutation?: string
    title?: string
    msisdn?: string
    also_known_as?: string

    htm?: string
    htu?: UriString | string
    ath?: Base64Url
    atc?: string
    sub_id?: JsonValue
    rcd?: JsonValue
    rcdi?: JsonValue
    crn?: string
    msgi?: JsonValue

    _claim_names?: Record<string, string>
    _claim_sources?: Record<string, ClaimSource>
    rdap_allowed_purposes?: string[]
    rdap_dnt_allowed?: boolean
    geohash?: string | string[]

    /** RFC 9901 digests for selectively disclosable object properties. */
    _sd?: Base64Url[]
    /** RFC 9901 array-element digest placeholder. */
    '...'?: Base64Url
    /** RFC 9901 digest algorithm. */
    _sd_alg?: HashAlgorithm
    /** RFC 9901 key-binding hash. */
    sd_hash?: Base64Url

    consumerPlmnId?: JsonValue
    consumerSnpnId?: JsonValue
    producerPlmnId?: JsonValue
    producerSnpnId?: JsonValue
    producerSnssaiList?: JsonValue
    producerNsiList?: JsonValue
    producerNfSetId?: string
    producerNfServiceSetId?: string
    sourceNfInstanceId?: string
    analyticsIdList?: JsonValue
    resOwnerId?: string

    cmw?: JsonValue
    jwks?: JsonWebKeySet
    metadata?: JsonObject
    constraints?: JsonObject
    crit?: string[]
    ref?: string
    delegation?: JsonValue
    logo_uri?: UriString | string
    authority_hints?: Array<StringOrURI | string>
    trust_anchor_hints?: Array<StringOrURI | string>
    trust_marks?: JsonValue
    trust_mark_issuers?: JsonValue
    trust_mark_owners?: JsonValue
    metadata_policy?: JsonObject
    metadata_policy_crit?: string[]
    source_endpoint?: UriString | string
    keys?: JsonWebKey[]
    trust_mark_type?: StringOrURI | string
    trust_chain?: CompactJwt[]
    trust_anchor?: StringOrURI | string

    status?: JwtStatusReference
    status_list?: JsonObject
    ttl?: number
    stpl?: string
}

export type JwtClaims<CustomClaims extends object = Record<never, never>> =
    IanaRegisteredJwtClaims & CustomClaims

/* -------------------------------------------------------------------------- */
/* Common standardized JWT profiles                                           */
/* -------------------------------------------------------------------------- */

export interface OpenIdConnectIdTokenClaims extends JwtRegisteredClaims {
    iss: StringOrURI | string
    sub: StringOrURI | string
    aud: JwtAudience
    exp: NumericDate
    iat: NumericDate
    auth_time?: NumericDate
    nonce?: string
    acr?: StringOrURI | string
    amr?: string[]
    azp?: string
    at_hash?: Base64Url
    c_hash?: Base64Url
}

export interface OAuth2JwtAccessTokenClaims extends JwtRegisteredClaims {
    iss: StringOrURI | string
    exp: NumericDate
    aud: JwtAudience
    sub: StringOrURI | string
    client_id: string
    iat: NumericDate
    jti: string
    scope?: string
    roles?: string[]
    groups?: string[]
    entitlements?: string[]
}

export interface DpopProofClaims extends JwtRegisteredClaims {
    jti: string
    htm: string
    htu: UriString | string
    iat: NumericDate
    nonce?: string
    ath?: Base64Url
}

export interface SdJwtClaims extends IanaRegisteredJwtClaims {
    _sd?: Base64Url[]
    _sd_alg?: HashAlgorithm
}

export type SdJwtDisclosure = Base64Url & {
    readonly __sdJwtDisclosureBrand: unique symbol
}

export type SdJwt = string & {
    readonly __sdJwtBrand: unique symbol
}

export type SdJwtPresentation = string & {
    readonly __sdJwtPresentationBrand: unique symbol
}

/* -------------------------------------------------------------------------- */
/* JWT compact forms and decoded structures                                   */
/* -------------------------------------------------------------------------- */

/** RFC 7519 JWTs use JWS Compact or JWE Compact Serialization. */
export type CompactJwt = CompactJws | CompactJwe

export interface DecodedJws<
    Claims extends object = IanaRegisteredJwtClaims,
    Header extends JwsHeaderParameters = JwsHeaderParameters
> {
    kind: 'JWS'
    compact: CompactJws
    protectedHeader: Header
    claims: Claims
    encodedProtectedHeader: Base64Url
    encodedPayload: Base64Url | string
    signature: Base64Url
}

export interface DecodedJwe<Header extends JweHeaderParameters = JweHeaderParameters> {
    kind: 'JWE'
    compact: CompactJwe
    protectedHeader: Header
    encodedProtectedHeader: Base64Url
    encryptedKey: Base64Url
    initializationVector: Base64Url
    ciphertext: Base64Url
    authenticationTag: Base64Url
}

export type DecodedJwt<Claims extends object = IanaRegisteredJwtClaims> =
    DecodedJws<Claims> | DecodedJwe

/* -------------------------------------------------------------------------- */
/* Type-only service contracts                                                */
/* -------------------------------------------------------------------------- */

export type JoseKeyMaterial = JsonWebKey | JsonWebKeySet | BinaryData | string

export interface JwtDecodeOptions {
    /** Parse payload JSON without validating cryptographic integrity. */
    parseClaims?: boolean
    /** Permit RFC 7797 unencoded JWS payloads. */
    allowUnencodedPayload?: boolean
}

export interface JwsSignOptions<Header extends JwsHeaderParameters = JwsHeaderParameters> {
    protectedHeader: Header
    unprotectedHeader?: Partial<Header>
    detached?: boolean
}

export interface JwsVerifyOptions {
    algorithms?: JwsAlgorithm[]
    criticalHeaders?: string[]
    detachedPayload?: string | BinaryData
}

export interface JweEncryptOptions<Header extends JweHeaderParameters = JweHeaderParameters> {
    protectedHeader: Header
    sharedUnprotectedHeader?: Partial<Header>
    additionalAuthenticatedData?: string | BinaryData
}

export interface JweDecryptOptions {
    keyManagementAlgorithms?: JweKeyManagementAlgorithm[]
    contentEncryptionAlgorithms?: JweContentEncryptionAlgorithm[]
    criticalHeaders?: string[]
}

export interface JwtValidationPolicy {
    issuers?: Array<StringOrURI | string>
    audiences?: Array<StringOrURI | string>
    subjects?: Array<StringOrURI | string>
    algorithms?: JwsAlgorithm[]
    requiredClaims?: Array<keyof IanaRegisteredJwtClaims | string>
    clockToleranceSeconds?: number
    maxTokenAgeSeconds?: number
    typ?: MediaType | string
}

export interface JwtValidationSuccess<Claims extends object = IanaRegisteredJwtClaims> {
    valid: true
    value: DecodedJws<Claims>
}

export interface JwtValidationFailure {
    valid: false
    code:
        | 'malformed'
        | 'unsupported_serialization'
        | 'unsupported_algorithm'
        | 'invalid_signature'
        | 'decryption_failed'
        | 'expired'
        | 'not_active'
        | 'issued_in_future'
        | 'issuer_mismatch'
        | 'audience_mismatch'
        | 'subject_mismatch'
        | 'missing_claim'
        | 'critical_header_unsupported'
        | 'policy_rejected'
        | (string & {})
    message: string
    cause?: unknown
}

export type JwtValidationResult<Claims extends object = IanaRegisteredJwtClaims> =
    JwtValidationSuccess<Claims> | JwtValidationFailure

export interface JwtDecoder {
    decode<Claims extends object = IanaRegisteredJwtClaims>(
        token: CompactJwt,
        options?: JwtDecodeOptions
    ): DecodedJwt<Claims>
}

export interface JwsSigner {
    signCompact<Claims extends object, Header extends JwsHeaderParameters = JwsHeaderParameters>(
        claims: Claims,
        key: JoseKeyMaterial,
        options: JwsSignOptions<Header>
    ): CompactJws

    signFlattened<Header extends JwsHeaderParameters = JwsHeaderParameters>(
        payload: string | BinaryData,
        key: JoseKeyMaterial,
        options: JwsSignOptions<Header>
    ): FlattenedJwsJsonSerialization<Header>
}

export interface JwsVerifier {
    verify<Claims extends object = IanaRegisteredJwtClaims>(
        jws: CompactJws | JwsJsonSerialization,
        key: JoseKeyMaterial,
        options?: JwsVerifyOptions
    ): JwtValidationResult<Claims>
}

export interface JweEncrypter {
    encryptCompact<Header extends JweHeaderParameters = JweHeaderParameters>(
        plaintext: string | BinaryData,
        key: JoseKeyMaterial,
        options: JweEncryptOptions<Header>
    ): CompactJwe

    encryptFlattened<Header extends JweHeaderParameters = JweHeaderParameters>(
        plaintext: string | BinaryData,
        key: JoseKeyMaterial,
        options: JweEncryptOptions<Header>
    ): FlattenedJweJsonSerialization<Header>
}

export interface JweDecrypter {
    decrypt(
        jwe: CompactJwe | JweJsonSerialization,
        key: JoseKeyMaterial,
        options?: JweDecryptOptions
    ): BinaryData
}

export interface JwkThumbprinter {
    thumbprint(key: JsonWebKey, hashAlgorithm?: HashAlgorithm): JwkThumbprint

    thumbprintUri(key: JsonWebKey, hashAlgorithm?: HashAlgorithm): JwkThumbprintUri
}

export interface JwksResolver {
    resolve(jwksUri: UriString | string): Promise<JsonWebKeySet>

    select(
        jwks: JsonWebKeySet,
        header: Pick<JoseCommonHeaderParameters, 'kid' | 'x5t' | 'x5t#S256'>
    ): JsonWebKey | undefined
}

/* -------------------------------------------------------------------------- */
/* Registry metadata contracts                                                */
/* -------------------------------------------------------------------------- */

export type JoseImplementationRequirement =
    | 'Required'
    | 'Recommended'
    | 'Recommended+'
    | 'Recommended-'
    | 'Optional'
    | 'Deprecated'
    | 'Prohibited'

export type JoseAlgorithmUsageLocation = 'alg' | 'enc' | 'JWK'

export interface JoseAlgorithmRegistryEntry {
    name: JoseAlgorithm
    description: string
    usage: JoseAlgorithmUsageLocation
    requirement: JoseImplementationRequirement
    reference: string
    analysisReference?: string
}

export type JoseHeaderUsageLocation = 'JWS' | 'JWE' | 'JWS, JWE'

export interface JoseHeaderParameterRegistryEntry {
    name: string
    description: string
    usage: JoseHeaderUsageLocation
    reference: string
}

export interface JwtClaimRegistryEntry {
    name: keyof IanaRegisteredJwtClaims | string
    description: string
    reference: string
}
