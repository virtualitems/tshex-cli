/**
 * Type-only specification for Open Graph metadata.
 *
 * Core protocol source: https://ogp.me/
 * Tool reference: https://opengraph.dev/
 * Facebook compatibility source: https://developers.facebook.com/documentation/sharing/webmasters
 *
 * This module intentionally contains no runtime values or implementations.
 */

/* -------------------------------------------------------------------------- */
/* Scalar types                                                               */
/* -------------------------------------------------------------------------- */

export type HttpUrl = `http://${string}` | `https://${string}`;
export type HttpsUrl = `https://${string}`;
export type MimeType = `${string}/${string}`;
export type Iso8601DateTime = string;
export type Iso4217CurrencyCode = string;
export type OpenGraphLocale = `${string}_${string}`;
export type IntegerString = `${bigint}`;
export type NumberString = `${number}`;
export type TwitterHandle = `@${string}`;

/** TypeScript cannot statically enforce integer, positive, ISO, MIME, or URL validity. */
export type PositiveInteger = number;

export type OneOrMore<T> = readonly [T, ...T[]];

/* -------------------------------------------------------------------------- */
/* Open Graph core                                                            */
/* -------------------------------------------------------------------------- */

export type OpenGraphDeterminer = "a" | "an" | "the" | "" | "auto";

export type OpenGraphStandardType =
  | "website"
  | "article"
  | "book"
  | "profile"
  | "music.song"
  | "music.album"
  | "music.playlist"
  | "music.radio_station"
  | "video.movie"
  | "video.episode"
  | "video.tv_show"
  | "video.other"
  | "payment.link";

/** Custom Open Graph types use CURIE syntax, such as "product:item". */
export type OpenGraphCustomType = `${string}:${string}`;
export type OpenGraphType = OpenGraphStandardType | OpenGraphCustomType;

export interface OpenGraphImage {
  readonly url: HttpUrl;
  readonly secureUrl?: HttpsUrl;
  readonly type?: MimeType;
  readonly width?: PositiveInteger;
  readonly height?: PositiveInteger;
  readonly alt?: string;
}

export interface OpenGraphVideo {
  readonly url: HttpUrl;
  readonly secureUrl?: HttpsUrl;
  readonly type?: MimeType;
  readonly width?: PositiveInteger;
  readonly height?: PositiveInteger;
  readonly alt?: string;
}

export interface OpenGraphAudio {
  readonly url: HttpUrl;
  readonly secureUrl?: HttpsUrl;
  readonly type?: MimeType;
}

export interface OpenGraphBase<TType extends OpenGraphType = OpenGraphType> {
  /** Required by the Open Graph protocol. */
  readonly title: string;
  /** Required by the Open Graph protocol. */
  readonly type: TType;
  /** Required by the Open Graph protocol. The first image has precedence. */
  readonly images: OneOrMore<OpenGraphImage>;
  /** Required by the Open Graph protocol. */
  readonly url: HttpUrl;

  readonly audio?: OneOrMore<OpenGraphAudio>;
  readonly description?: string;
  readonly determiner?: OpenGraphDeterminer;
  readonly locale?: OpenGraphLocale;
  readonly alternateLocales?: OneOrMore<OpenGraphLocale>;
  readonly siteName?: string;
  readonly videos?: OneOrMore<OpenGraphVideo>;
}

export interface OpenGraphObjectExtensions {
  /** Namespaced custom properties, represented without interpreting their values. */
  readonly extensions?: Readonly<
    Partial<Record<`${string}:${string}`, string | OneOrMore<string>>>
  >;
}

/* -------------------------------------------------------------------------- */
/* Open Graph object references and structured relations                      */
/* -------------------------------------------------------------------------- */

export type OpenGraphProfileReference = HttpUrl;
export type OpenGraphMusicSongReferenceUrl = HttpUrl;
export type OpenGraphMusicAlbumReferenceUrl = HttpUrl;
export type OpenGraphVideoSeriesReference = HttpUrl;

export interface OpenGraphMusicAlbumReference {
  readonly url: OpenGraphMusicAlbumReferenceUrl;
  readonly disc?: PositiveInteger;
  readonly track?: PositiveInteger;
}

export interface OpenGraphMusicSongReference {
  readonly url: OpenGraphMusicSongReferenceUrl;
  readonly disc?: PositiveInteger;
  readonly track?: PositiveInteger;
}

export interface OpenGraphVideoActorReference {
  readonly url: OpenGraphProfileReference;
  readonly role?: string;
}

/* -------------------------------------------------------------------------- */
/* Standard object types                                                      */
/* -------------------------------------------------------------------------- */

export interface OpenGraphWebsite
  extends OpenGraphBase<"website">,
    OpenGraphObjectExtensions {}

export interface OpenGraphArticle
  extends OpenGraphBase<"article">,
    OpenGraphObjectExtensions {
  readonly publishedTime?: Iso8601DateTime;
  readonly modifiedTime?: Iso8601DateTime;
  readonly expirationTime?: Iso8601DateTime;
  readonly authors?: OneOrMore<OpenGraphProfileReference>;
  readonly section?: string;
  readonly tags?: OneOrMore<string>;
}

export interface OpenGraphBook
  extends OpenGraphBase<"book">,
    OpenGraphObjectExtensions {
  readonly authors?: OneOrMore<OpenGraphProfileReference>;
  readonly isbn?: string;
  readonly releaseDate?: Iso8601DateTime;
  readonly tags?: OneOrMore<string>;
}

export type OpenGraphProfileGender = "male" | "female";

export interface OpenGraphProfile
  extends OpenGraphBase<"profile">,
    OpenGraphObjectExtensions {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly username?: string;
  readonly gender?: OpenGraphProfileGender;
}

export interface OpenGraphMusicSong
  extends OpenGraphBase<"music.song">,
    OpenGraphObjectExtensions {
  readonly duration?: PositiveInteger;
  readonly albums?: OneOrMore<OpenGraphMusicAlbumReference>;
  readonly musicians?: OneOrMore<OpenGraphProfileReference>;
}

export interface OpenGraphMusicAlbum
  extends OpenGraphBase<"music.album">,
    OpenGraphObjectExtensions {
  readonly songs?: OneOrMore<OpenGraphMusicSongReference>;
  readonly musicians?: OneOrMore<OpenGraphProfileReference>;
  readonly releaseDate?: Iso8601DateTime;
}

export interface OpenGraphMusicPlaylist
  extends OpenGraphBase<"music.playlist">,
    OpenGraphObjectExtensions {
  readonly songs?: OneOrMore<OpenGraphMusicSongReference>;
  readonly creator?: OpenGraphProfileReference;
}

export interface OpenGraphMusicRadioStation
  extends OpenGraphBase<"music.radio_station">,
    OpenGraphObjectExtensions {
  readonly creator?: OpenGraphProfileReference;
}

export interface OpenGraphVideoMetadata {
  readonly actors?: OneOrMore<OpenGraphVideoActorReference>;
  readonly directors?: OneOrMore<OpenGraphProfileReference>;
  readonly writers?: OneOrMore<OpenGraphProfileReference>;
  readonly duration?: PositiveInteger;
  readonly releaseDate?: Iso8601DateTime;
  readonly tags?: OneOrMore<string>;
}

export interface OpenGraphVideoMovie
  extends OpenGraphBase<"video.movie">,
    OpenGraphVideoMetadata,
    OpenGraphObjectExtensions {}

export interface OpenGraphVideoEpisode
  extends OpenGraphBase<"video.episode">,
    OpenGraphVideoMetadata,
    OpenGraphObjectExtensions {
  readonly series?: OpenGraphVideoSeriesReference;
}

export interface OpenGraphVideoTvShow
  extends OpenGraphBase<"video.tv_show">,
    OpenGraphVideoMetadata,
    OpenGraphObjectExtensions {}

export interface OpenGraphVideoOther
  extends OpenGraphBase<"video.other">,
    OpenGraphVideoMetadata,
    OpenGraphObjectExtensions {}

export type OpenGraphPaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "EXPIRED";

/** `payment.link` is marked beta by the Open Graph protocol. */
export interface OpenGraphPaymentLink
  extends OpenGraphBase<"payment.link">,
    OpenGraphObjectExtensions {
  readonly paymentDescription?: string;
  readonly currency?: Iso4217CurrencyCode;
  readonly amount?: number;
  readonly expiresAt?: Iso8601DateTime;
  readonly paymentStatus?: OpenGraphPaymentStatus;
  readonly paymentId?: string;
  readonly successUrl?: HttpUrl;
}

export interface OpenGraphCustomObject
  extends OpenGraphBase<OpenGraphCustomType>,
    OpenGraphObjectExtensions {}

export type OpenGraphMetadata =
  | OpenGraphWebsite
  | OpenGraphArticle
  | OpenGraphBook
  | OpenGraphProfile
  | OpenGraphMusicSong
  | OpenGraphMusicAlbum
  | OpenGraphMusicPlaylist
  | OpenGraphMusicRadioStation
  | OpenGraphVideoMovie
  | OpenGraphVideoEpisode
  | OpenGraphVideoTvShow
  | OpenGraphVideoOther
  | OpenGraphPaymentLink
  | OpenGraphCustomObject;

/* -------------------------------------------------------------------------- */
/* Raw Open Graph meta-tag representation                                     */
/* -------------------------------------------------------------------------- */

export interface PropertyMetaTag<
  TProperty extends string = string,
  TContent extends string = string,
> {
  readonly property: TProperty;
  readonly content: TContent;
}

export type OpenGraphCoreMetaTag =
  | PropertyMetaTag<"og:title">
  | PropertyMetaTag<"og:type", OpenGraphType>
  | PropertyMetaTag<"og:image", HttpUrl>
  | PropertyMetaTag<"og:url", HttpUrl>
  | PropertyMetaTag<"og:audio", HttpUrl>
  | PropertyMetaTag<"og:description">
  | PropertyMetaTag<"og:determiner", OpenGraphDeterminer>
  | PropertyMetaTag<"og:locale", OpenGraphLocale>
  | PropertyMetaTag<"og:locale:alternate", OpenGraphLocale>
  | PropertyMetaTag<"og:site_name">
  | PropertyMetaTag<"og:video", HttpUrl>;

export type OpenGraphImageMetaTag =
  | PropertyMetaTag<"og:image:url", HttpUrl>
  | PropertyMetaTag<"og:image:secure_url", HttpsUrl>
  | PropertyMetaTag<"og:image:type", MimeType>
  | PropertyMetaTag<"og:image:width", IntegerString>
  | PropertyMetaTag<"og:image:height", IntegerString>
  | PropertyMetaTag<"og:image:alt">;

export type OpenGraphVideoMetaTag =
  | PropertyMetaTag<"og:video:url", HttpUrl>
  | PropertyMetaTag<"og:video:secure_url", HttpsUrl>
  | PropertyMetaTag<"og:video:type", MimeType>
  | PropertyMetaTag<"og:video:width", IntegerString>
  | PropertyMetaTag<"og:video:height", IntegerString>
  | PropertyMetaTag<"og:video:alt">;

export type OpenGraphAudioMetaTag =
  | PropertyMetaTag<"og:audio:url", HttpUrl>
  | PropertyMetaTag<"og:audio:secure_url", HttpsUrl>
  | PropertyMetaTag<"og:audio:type", MimeType>;

export type OpenGraphMusicMetaTag =
  | PropertyMetaTag<"music:duration", IntegerString>
  | PropertyMetaTag<"music:album", HttpUrl>
  | PropertyMetaTag<"music:album:disc", IntegerString>
  | PropertyMetaTag<"music:album:track", IntegerString>
  | PropertyMetaTag<"music:musician", HttpUrl>
  | PropertyMetaTag<"music:song", HttpUrl>
  | PropertyMetaTag<"music:song:disc", IntegerString>
  | PropertyMetaTag<"music:song:track", IntegerString>
  | PropertyMetaTag<"music:release_date", Iso8601DateTime>
  | PropertyMetaTag<"music:creator", HttpUrl>;

export type OpenGraphVideoObjectMetaTag =
  | PropertyMetaTag<"video:actor", HttpUrl>
  | PropertyMetaTag<"video:actor:role">
  | PropertyMetaTag<"video:director", HttpUrl>
  | PropertyMetaTag<"video:writer", HttpUrl>
  | PropertyMetaTag<"video:duration", IntegerString>
  | PropertyMetaTag<"video:release_date", Iso8601DateTime>
  | PropertyMetaTag<"video:tag">
  | PropertyMetaTag<"video:series", HttpUrl>;

export type OpenGraphArticleMetaTag =
  | PropertyMetaTag<"article:published_time", Iso8601DateTime>
  | PropertyMetaTag<"article:modified_time", Iso8601DateTime>
  | PropertyMetaTag<"article:expiration_time", Iso8601DateTime>
  | PropertyMetaTag<"article:author", HttpUrl>
  | PropertyMetaTag<"article:section">
  | PropertyMetaTag<"article:tag">;

export type OpenGraphBookMetaTag =
  | PropertyMetaTag<"book:author", HttpUrl>
  | PropertyMetaTag<"book:isbn">
  | PropertyMetaTag<"book:release_date", Iso8601DateTime>
  | PropertyMetaTag<"book:tag">;

export type OpenGraphProfileMetaTag =
  | PropertyMetaTag<"profile:first_name">
  | PropertyMetaTag<"profile:last_name">
  | PropertyMetaTag<"profile:username">
  | PropertyMetaTag<"profile:gender", OpenGraphProfileGender>;

export type OpenGraphPaymentMetaTag =
  | PropertyMetaTag<"payment:description">
  | PropertyMetaTag<"payment:currency", Iso4217CurrencyCode>
  | PropertyMetaTag<"payment:amount", NumberString>
  | PropertyMetaTag<"payment:expires_at", Iso8601DateTime>
  | PropertyMetaTag<"payment:status", OpenGraphPaymentStatus>
  | PropertyMetaTag<"payment:id">
  | PropertyMetaTag<"payment:success_url", HttpUrl>;

export type OpenGraphStandardMetaTag =
  | OpenGraphCoreMetaTag
  | OpenGraphImageMetaTag
  | OpenGraphVideoMetaTag
  | OpenGraphAudioMetaTag
  | OpenGraphMusicMetaTag
  | OpenGraphVideoObjectMetaTag
  | OpenGraphArticleMetaTag
  | OpenGraphBookMetaTag
  | OpenGraphProfileMetaTag
  | OpenGraphPaymentMetaTag;

export type OpenGraphCustomMetaTag = PropertyMetaTag<
  `${string}:${string}`,
  string
>;

export type OpenGraphMetaTag =
  | OpenGraphStandardMetaTag
  | OpenGraphCustomMetaTag;

/* -------------------------------------------------------------------------- */
/* Twitter Card compatibility namespace                                      */
/* -------------------------------------------------------------------------- */

export type TwitterCardType =
  | "summary"
  | "summary_large_image"
  | "app"
  | "player";

export interface TwitterCardBase<TCard extends TwitterCardType> {
  readonly card: TCard;
  readonly site?: TwitterHandle;
  readonly siteId?: string;
  readonly creator?: TwitterHandle;
  readonly creatorId?: string;
  readonly title?: string;
  readonly description?: string;
}

export interface TwitterCardImage {
  readonly url: HttpUrl;
  readonly alt?: string;
}

export interface TwitterSummaryCard
  extends TwitterCardBase<"summary"> {
  readonly image?: TwitterCardImage;
}

export interface TwitterSummaryLargeImageCard
  extends TwitterCardBase<"summary_large_image"> {
  readonly image?: TwitterCardImage;
}

export interface TwitterPlayerCard
  extends TwitterCardBase<"player"> {
  readonly image: TwitterCardImage;
  readonly player: HttpsUrl;
  readonly playerWidth: PositiveInteger;
  readonly playerHeight: PositiveInteger;
  readonly playerStream?: HttpsUrl;
  readonly playerStreamContentType?: MimeType;
}

export interface TwitterAppPlatform {
  readonly name?: string;
  readonly id?: string;
  readonly url?: string;
}

export interface TwitterAppCard
  extends TwitterCardBase<"app"> {
  readonly country?: string;
  readonly iphone?: TwitterAppPlatform;
  readonly ipad?: TwitterAppPlatform;
  readonly googlePlay?: TwitterAppPlatform;
}

export type TwitterCardMetadata =
  | TwitterSummaryCard
  | TwitterSummaryLargeImageCard
  | TwitterPlayerCard
  | TwitterAppCard;

export interface NameMetaTag<
  TName extends string = string,
  TContent extends string = string,
> {
  readonly name: TName;
  readonly content: TContent;
}

export type TwitterMetaTag =
  | NameMetaTag<"twitter:card", TwitterCardType>
  | NameMetaTag<"twitter:site", TwitterHandle>
  | NameMetaTag<"twitter:site:id">
  | NameMetaTag<"twitter:creator", TwitterHandle>
  | NameMetaTag<"twitter:creator:id">
  | NameMetaTag<"twitter:title">
  | NameMetaTag<"twitter:description">
  | NameMetaTag<"twitter:image", HttpUrl>
  | NameMetaTag<"twitter:image:alt">
  | NameMetaTag<"twitter:player", HttpsUrl>
  | NameMetaTag<"twitter:player:width", IntegerString>
  | NameMetaTag<"twitter:player:height", IntegerString>
  | NameMetaTag<"twitter:player:stream", HttpsUrl>
  | NameMetaTag<"twitter:player:stream:content_type", MimeType>
  | NameMetaTag<"twitter:app:country">
  | NameMetaTag<"twitter:app:name:iphone">
  | NameMetaTag<"twitter:app:id:iphone">
  | NameMetaTag<"twitter:app:url:iphone">
  | NameMetaTag<"twitter:app:name:ipad">
  | NameMetaTag<"twitter:app:id:ipad">
  | NameMetaTag<"twitter:app:url:ipad">
  | NameMetaTag<"twitter:app:name:googleplay">
  | NameMetaTag<"twitter:app:id:googleplay">
  | NameMetaTag<"twitter:app:url:googleplay">;

/* -------------------------------------------------------------------------- */
/* Facebook and HTML-head compatibility                                      */
/* -------------------------------------------------------------------------- */

export interface FacebookOpenGraphMetadata {
  readonly appId?: string;
}

export type FacebookMetaTag = PropertyMetaTag<"fb:app_id">;

export interface StandardHeadMetadata {
  readonly title?: string;
  readonly description?: string;
  readonly canonicalUrl?: HttpUrl;
  readonly themeColor?: string;
}

export type StandardHtmlMetaTag =
  | NameMetaTag<"description">
  | NameMetaTag<"theme-color">;

export interface CanonicalLinkTag {
  readonly rel: "canonical";
  readonly href: HttpUrl;
}

/* -------------------------------------------------------------------------- */
/* Aggregate document contract                                               */
/* -------------------------------------------------------------------------- */

export interface SocialMetadataDocument {
  readonly head?: StandardHeadMetadata;
  readonly openGraph: OpenGraphMetadata;
  readonly twitter?: TwitterCardMetadata;
  readonly facebook?: FacebookOpenGraphMetadata;
}

export type SocialMetaTag =
  | OpenGraphMetaTag
  | TwitterMetaTag
  | FacebookMetaTag
  | StandardHtmlMetaTag;

export interface RawSocialMetadataDocument {
  readonly title?: string;
  readonly meta: readonly SocialMetaTag[];
  readonly links?: readonly CanonicalLinkTag[];
}
