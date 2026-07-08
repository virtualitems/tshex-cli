/**
 * @description
 */
export interface HttpRequest {}

/**
 * @description
 */
export interface HttpResponse {}

/**
 * @description
 */
export interface HttpResponseBody {
    [property: string]: unknown
    readonly data: Record<string, unknown> | null
    readonly errors: string[] | null
    readonly links: Record<string, URL> | null
}

/**
 * @description
 */
export interface HttpRequestHandler {
    handle(request: HttpRequest): HttpResponse | Promise<HttpResponse>
}

/**
 * @description
 */
export interface HttpMiddleware {
    process(
        request: HttpRequest,
        handler: HttpRequestHandler
    ): HttpResponse | Promise<HttpResponse>
}
