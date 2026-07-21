### Open Graph

`opengraph.ts` declares a type-only implementation of the
[Open Graph protocol](https://ogp.me/), the Twitter Card meta tags, and
Facebook's compatibility extensions. It is used when an adapter needs to build
or read the social-sharing metadata of a page.

This module has no runtime values or implementations, including no HTML
rendering. Use it to build the data and a separate template or renderer to
emit the actual `<meta>` tags.

#### Base Shape

Every Open Graph object shares `OpenGraphBase<TType>`: the required `title`,
`type`, `images` (`OneOrMore<OpenGraphImage>`, first has precedence), and
`url`, plus the optional `audio`, `description`, `determiner`, `locale`,
`alternateLocales`, `siteName`, and `videos`. `OpenGraphObjectExtensions`
adds an optional `extensions` map for CURIE-namespaced custom properties
(`'product:color'`, etc.), kept as opaque strings.

#### Standard Object Types

`OpenGraphType` selects one of thirteen standard types
(`OpenGraphStandardType`) or a custom CURIE type
(`OpenGraphCustomType`, e.g. `'product:item'`). Each standard type has its
own interface adding the fields that type requires:

| `type` | Interface | Extra fields |
| --- | --- | --- |
| `'website'` | `OpenGraphWebsite` | none |
| `'article'` | `OpenGraphArticle` | `publishedTime`, `modifiedTime`, `expirationTime`, `authors`, `section`, `tags` |
| `'book'` | `OpenGraphBook` | `authors`, `isbn`, `releaseDate`, `tags` |
| `'profile'` | `OpenGraphProfile` | `firstName`, `lastName`, `username`, `gender` |
| `'music.song'` | `OpenGraphMusicSong` | `duration`, `albums`, `musicians` |
| `'music.album'` | `OpenGraphMusicAlbum` | `songs`, `musicians`, `releaseDate` |
| `'music.playlist'` | `OpenGraphMusicPlaylist` | `songs`, `creator` |
| `'music.radio_station'` | `OpenGraphMusicRadioStation` | `creator` |
| `'video.movie'` | `OpenGraphVideoMovie` | `actors`, `directors`, `writers`, `duration`, `releaseDate`, `tags` (`OpenGraphVideoMetadata`) |
| `'video.episode'` | `OpenGraphVideoEpisode` | `OpenGraphVideoMetadata` + `series` |
| `'video.tv_show'` | `OpenGraphVideoTvShow` | `OpenGraphVideoMetadata` |
| `'video.other'` | `OpenGraphVideoOther` | `OpenGraphVideoMetadata` |
| `'payment.link'` | `OpenGraphPaymentLink` | `paymentDescription`, `currency`, `amount`, `expiresAt`, `paymentStatus`, `paymentId`, `successUrl` (marked beta by the protocol) |
| CURIE type | `OpenGraphCustomObject` | none beyond the base shape |

`OpenGraphMetadata` is the union of all fourteen. Building one selects the
type through the discriminant and, from there, TypeScript narrows to that
type's own extra fields.

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

```ts title="users/adapters/article-metadata.ts"
import { OpenGraphArticle } from '../../shared/application/http/opengraph.js'

export function buildArticleMetadata(slug: string): OpenGraphArticle {
    return {
        type: 'article',
        title: 'How context ports work',
        url: `https://example.com/blog/${slug}`,
        images: [{ url: `https://example.com/blog/${slug}/cover.png` }],
        publishedTime: new Date().toISOString(),
        tags: ['architecture', 'typescript'],
    }
}
```

`OpenGraphPaymentStatus` (`'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED'`) types
`OpenGraphPaymentLink['paymentStatus']`.

#### Twitter Cards

`TwitterCardType` selects one of four card layouts. `TwitterCardBase<TCard>`
carries the members every card shares (`site`, `siteId`, `creator`,
`creatorId`, `title`, `description`); each concrete card adds the fields that
layout needs:

| `card` | Interface | Extra/required fields |
| --- | --- | --- |
| `'summary'` | `TwitterSummaryCard` | optional `image` |
| `'summary_large_image'` | `TwitterSummaryLargeImageCard` | optional `image` |
| `'player'` | `TwitterPlayerCard` | required `image`, `player`, `playerWidth`, `playerHeight`; optional `playerStream`, `playerStreamContentType` |
| `'app'` | `TwitterAppCard` | optional `country`, `iphone`, `ipad`, `googlePlay` (each `TwitterAppPlatform`) |

`TwitterCardMetadata` is the union of all four.

```ts
import type { TwitterPlayerCard } from '../../../shared/application/http/opengraph.js'

const playerCard: TwitterPlayerCard = {
    card: 'player',
    image: { url: 'https://example.com/videos/1/thumb.png' },
    player: 'https://example.com/videos/1/embed',
    playerWidth: 640,
    playerHeight: 360,
}
```

#### Raw Meta Tag Representation

`OpenGraphMetaTag`/`TwitterMetaTag` are the flat `property`/`content` and
`name`/`content` tag forms closer to the actual `<meta>` markup, for a
renderer that emits tags directly instead of consuming the structured
objects above.

| Tag family | Type | Attribute pair |
| --- | --- | --- |
| Open Graph (standard) | `OpenGraphStandardMetaTag` | `property`/`content`, e.g. `'og:title'` |
| Open Graph (custom) | `OpenGraphCustomMetaTag` | any `` `${string}:${string}` `` property |
| Twitter | `TwitterMetaTag` | `name`/`content`, e.g. `'twitter:card'` |
| Facebook | `FacebookMetaTag` | `PropertyMetaTag<'fb:app_id'>` |
| Standard HTML | `StandardHtmlMetaTag` | `'description'` \| `'theme-color'` |

`SocialMetaTag` is the union of all five families. `CanonicalLinkTag` types
the `<link rel="canonical">` element separately, since it is not a `<meta>`
tag.

#### Aggregate Document

Two document shapes cover the two stages of building a page's social
metadata:

| Type | Shape | Use |
| --- | --- | --- |
| `SocialMetadataDocument` | `head?`, `openGraph` (required), `twitter?`, `facebook?` | Structured data a service builds before rendering |
| `RawSocialMetadataDocument` | `title?`, `meta: SocialMetaTag[]`, `links?: CanonicalLinkTag[]` | The rendered, tag-list form a template consumes |

```ts title="users/adapters/social-metadata-document.ts"
import {
    SocialMetadataDocument,
    OpenGraphProfile,
} from '../../shared/application/http/opengraph.js'

export function buildSocialMetadata(profile: OpenGraphProfile): SocialMetadataDocument {
    return {
        head: { title: profile.title, description: profile.description },
        openGraph: profile,
        twitter: { card: 'summary', title: profile.title },
    }
}
```

Converting a `SocialMetadataDocument` into a `RawSocialMetadataDocument` is
the responsibility of a renderer, which flattens each structured field into
its corresponding `SocialMetaTag` entries; that conversion is not implemented
by this module.

> **Hint**
> This module has no runtime implementation, including no HTML rendering. Use
> `OpenGraphMetadata` to build the data and a separate template or renderer to
> emit the `<meta>` tags described by `OpenGraphMetaTag`/`TwitterMetaTag`.
