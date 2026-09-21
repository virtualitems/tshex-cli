### `lib/shared/application/http/errors.ts`

`HttpError` extends `Error` with an HTTP status code and a standard message
table for the generated four-hundred and five-hundred status codes.

#### Signal a transport outcome

```ts
throw new HttpError(404)
// Error message: Not Found
```

Pass a second argument to replace the standard message. An unlisted code uses
`Unknown Error`. `HttpError` does not create an HTTP response, serialize an
error body, or validate that a code is a standard status.
