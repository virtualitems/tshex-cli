### JSON Web Tokens

`json-web-token.ts` declares a type-only implementation of the JOSE and JWT
family of RFCs (JWS, JWE, JWK, JWT, and related extensions such as DPoP and
selective disclosure). It lets an adapter describe tokens and keys precisely
without depending on a specific JOSE library's own types.

This module has no runtime implementation. Pair it with a concrete JOSE
library (for signing, encryption, or verification) and use these types to
annotate its inputs and outputs.

#### Branded Wire Values

Wire-format primitives are branded so a plain `string` cannot be passed where
an encoded value is expected: `Base64Url`, `Base64`, `NumericDate`,
`StringOrURI`, `UriString`, `MediaType`, and `KeyId`. `BinaryData` is the
union `ArrayBuffer | Uint8Array` used wherever a JOSE library accepts raw
bytes.

#### JSON Web Keys

Every JWK shares `JwkCommonParameters` (`kty`, `use`, `key_ops`, `alg`, `kid`,
the `x5*` certificate members, and the OpenID Federation `iat`/`nbf`/`exp`/
`revoked` members). `JwkKeyType` (`kty`) then selects one of five key-family
options, each with a public and a private variant where the family supports
one:

| `kty` | Curve/size parameter | Public type | Private type |
| --- | --- | --- | --- |
| `'EC'` | `EcCurve` (`P-256`, `P-384`, `P-521`, `secp256k1`) | `EcPublicJwk` (`x`, `y`) | `EcPrivateJwk` (adds `d`) |
| `'RSA'` | — | `RsaPublicJwk` (`n`, `e`) | `RsaPrivateJwk` (adds `d`, `p`, `q`, `dp`, `dq`, `qi`, `oth`) |
| `'oct'` | — | — (symmetric only) | `OctJwk` (`k`) |
| `'OKP'` | `OkpCurve` (`Ed25519`, `Ed448`, `X25519`, `X448`) | `OkpPublicJwk` (`x`) | `OkpPrivateJwk` (adds `d`) |
| `'AKP'` | `MldsaAlgorithm` (`ML-DSA-44`/`65`/`87`) | `AkpPublicJwk` (`pub`) | `AkpPrivateJwk` (adds `priv`) |

`PublicJwk` and `PrivateJwk` are the unions across all five families;
`JsonWebKey` is `PublicJwk | PrivateJwk`.

```ts
import type { EcPublicJwk, RsaPrivateJwk, OctJwk } from '../../../shared/application/http/json-web-token.js'

const ecKey: EcPublicJwk = { kty: 'EC', crv: 'P-256', x: '...' as Base64Url, y: '...' as Base64Url }
const rsaKey: RsaPrivateJwk = { kty: 'RSA', n: '...' as Base64Url, e: '...' as Base64Url, d: '...' as Base64Url }
const symmetricKey: OctJwk = { kty: 'oct', k: '...' as Base64Url }
```

`JsonWebKeySet` wraps a `keys` array of mixed key types; `PublicJsonWebKeySet`
narrows that array to public keys only, for a key set safe to publish. A
thumbprint (`JwkThumbprint`) is a `Base64Url`; `JwkThumbprintUri` is the
`urn:ietf:params:oauth:jwk-thumbprint:` URI form.

#### Headers

`JoseCommonHeaderParameters` covers the parameters shared by both header
kinds (`jku`, `jwk`, `kid`, the `x5*` members, `typ`, `cty`, `crit`).
`JwsHeaderParameters` and `JweHeaderParameters` extend it with the two
distinct options:

| Type | Required members | Extra members |
| --- | --- | --- |
| `JwsHeaderParameters` | `alg: JwsAlgorithm` | `b64`, `ppt`, `url`, `nonce`, `svt`, `jwt`, `client_id`, `trust_chain`, `peer_trust_chain` |
| `JweHeaderParameters` | `alg: JweKeyManagementAlgorithm`, `enc: JweContentEncryptionAlgorithm` | `zip`, `epk`, `apu`, `apv`, `iv`, `tag`, `p2s`, `p2c`, replicated `iss`/`sub`/`aud`, `url`, `nonce` |

`JwsHeader<CustomHeader>` and `JweHeader<CustomHeader>` intersect the
respective parameters with a caller-supplied custom header shape.

#### Serializations

A JWS or a JWE can be represented four ways: as a single delimited string
(compact), or as JSON with either one signer/recipient inlined (flattened) or
several (general).

| Type | Kind | Shape |
| --- | --- | --- |
| `CompactJws` | JWS, compact | `` `${string}.${string}.${string}` `` branded string |
| `GeneralJwsJsonSerialization` | JWS, JSON, general | `payload` + `signatures[]` |
| `FlattenedJwsJsonSerialization` | JWS, JSON, flattened | `payload` + one signature inlined |
| `CompactJwe` | JWE, compact | `` `${string}.${string}.${string}.${string}.${string}` `` branded string |
| `GeneralJweJsonSerialization` | JWE, JSON, general | shared members + `recipients[]` |
| `FlattenedJweJsonSerialization` | JWE, JSON, flattened | shared members + one recipient inlined |

`JwsJsonSerialization` and `JweJsonSerialization` are the general/flattened
unions for each. `UnsecuredCompactJws` types the `alg: 'none'` compact form
(`` `${string}.${string}.` `` — an empty signature segment).

```ts
import type { CompactJws, FlattenedJwsJsonSerialization } from '../../../shared/application/http/json-web-token.js'

const compact = 'eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiIxIn0.c2ln' as CompactJws

const flattened: FlattenedJwsJsonSerialization = {
    payload: 'eyJzdWIiOiIxIn0' as Base64Url,
    protected: 'eyJhbGciOiJFUzI1NiJ9' as Base64Url,
    signature: 'c2ln' as Base64Url,
}
```

`DecodedJws` and `DecodedJwe` describe a decoded token's structure;
`DecodedJwt` is their union, discriminated by a `kind: 'JWS' | 'JWE'` tag.
`CompactJwt` is `CompactJws | CompactJwe`, matching how RFC 7519 allows a JWT
to use either serialization.

#### JWT Claims

`JwtRegisteredClaims` covers the seven RFC 7519 claims (`iss`, `sub`, `aud`,
`exp`, `nbf`, `iat`, `jti`). `IanaRegisteredJwtClaims` extends it with every
claim name currently registered by IANA (OpenID Connect profile claims, SIP,
CDNI, GNAP, EAT, RATS, RFC 9901 selective-disclosure claims, OpenID
Federation claims, and more), so `JwtClaims<CustomClaims>` covers arbitrary
custom claims through intersection while still typing every standard one.

Four ready-made profiles fix `JwtRegisteredClaims` members to `required`
where the profile mandates them, as distinct implementation options for
common token kinds:

| Type | Profile | Required beyond the base seven |
| --- | --- | --- |
| `OpenIdConnectIdTokenClaims` | OIDC ID Token | `iss`, `sub`, `aud`, `exp`, `iat` |
| `OAuth2JwtAccessTokenClaims` | RFC 9068 OAuth 2.0 access token | `iss`, `exp`, `aud`, `sub`, `client_id`, `iat`, `jti` |
| `DpopProofClaims` | RFC 9449 DPoP proof | `jti`, `htm`, `htu`, `iat` |
| `SdJwtClaims` | RFC 9901 SD-JWT | none beyond `IanaRegisteredJwtClaims`, adds `_sd`/`_sd_alg` |

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

`SdJwtDisclosure`, `SdJwt`, and `SdJwtPresentation` brand the three distinct
string forms used by selective disclosure: a single disclosure, an issued
SD-JWT, and a presentation with disclosures appended.

#### Service Contracts

An adapter implements these interfaces against a concrete JOSE library. Each
one exposes a distinct operation:

| Contract | Method(s) | Responsibility |
| --- | --- | --- |
| `JwtDecoder` | `decode()` | Parse a compact token into a `DecodedJwt` without necessarily validating it. |
| `JwsSigner` | `signCompact()`, `signFlattened()` | Produce a JWS in either serialization. |
| `JwsVerifier` | `verify()` | Validate a JWS and return a `JwtValidationResult`. |
| `JweEncrypter` | `encryptCompact()`, `encryptFlattened()` | Produce a JWE in either serialization. |
| `JweDecrypter` | `decrypt()` | Decrypt a JWE back into `BinaryData`. |
| `JwkThumbprinter` | `thumbprint()`, `thumbprintUri()` | Compute an RFC 7638 thumbprint, plain or as a URI. |
| `JwksResolver` | `resolve()`, `select()` | Fetch a JWK Set and pick the key matching a header's `kid`/`x5t`/`x5t#S256`. |

```ts
import type { JwkThumbprinter, JsonWebKey } from '../../../shared/application/http/json-web-token.js'

function fingerprint(thumbprinter: JwkThumbprinter, key: JsonWebKey) {
    return thumbprinter.thumbprintUri(key)
}
```

#### Validating A Token

`JwtValidationResult` is the outcome of checking a token against a
`JwtValidationPolicy` (`issuers`, `audiences`, `subjects`, `algorithms`,
`requiredClaims`, `clockToleranceSeconds`, `maxTokenAgeSeconds`, `typ`). It
has exactly two implementation options, discriminated by `valid`:

| Type | `valid` | Payload |
| --- | --- | --- |
| `JwtValidationSuccess` | `true` | `value: DecodedJws<Claims>` |
| `JwtValidationFailure` | `false` | `code`, `message`, optional `cause` |

`JwtValidationFailure['code']` enumerates the recognized rejection reasons:
`'malformed'`, `'unsupported_serialization'`, `'unsupported_algorithm'`,
`'invalid_signature'`, `'decryption_failed'`, `'expired'`, `'not_active'`,
`'issued_in_future'`, `'issuer_mismatch'`, `'audience_mismatch'`,
`'subject_mismatch'`, `'missing_claim'`, `'critical_header_unsupported'`, and
`'policy_rejected'` (plus an open string for adapter-specific codes).

```ts
import type { JwtValidationResult } from '../../../shared/application/http/json-web-token.js'

function describeResult(result: JwtValidationResult): string {
    if (result.valid) {
        return `ok, subject=${result.value.claims.sub}`
    }

    return `rejected: ${result.code}`
}
```

#### Registry Metadata

`JoseAlgorithmRegistryEntry`, `JoseHeaderParameterRegistryEntry`, and
`JwtClaimRegistryEntry` type the shape of a row describing an algorithm, a
header parameter, or a claim, for adapters that want to render or validate
against IANA's own registry data instead of hardcoding the unions above.

> **Hint**
> This module has no runtime implementation. Choose a JOSE library, then use
> `JwsSigner`/`JwsVerifier`/`JweEncrypter`/`JweDecrypter`/`JwtDecoder` to
> annotate its inputs and outputs so the rest of the codebase stays independent
> from that library's own types.
