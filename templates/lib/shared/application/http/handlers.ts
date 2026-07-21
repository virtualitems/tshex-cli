/**
 * @description Http request handler to process incoming requests and generate responses.
 */
export interface HttpRequestHandler {
    handle(request: Request): Response | Promise<Response>
}

/**
 * @description An HTTP middleware that pipes requests through handlers.
 */
export interface HttpMiddleware {
    process(request: Request, handler: HttpRequestHandler): Response | Promise<Response>
}
