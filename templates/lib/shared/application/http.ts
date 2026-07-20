/**
 * @description
 */
export interface HttpResponseBody {
    readonly data: Record<string, unknown> | null
    readonly errors: string[] | null
    readonly links: Record<string, URL> | null
}

/**
 * @description
 */
export interface HttpRequestHandler {
    handle(request: Request): Response | Promise<Response>
}

/**
 * @description
 */
export interface HttpMiddleware {
    process(
        request: Request,
        handler: HttpRequestHandler
    ): Response | Promise<Response>
}
