### `lib/shared/application/http/errors.ts`

This module defines the errors that application code uses to report HTTP
failures. The errors carry the transport information required for another layer
to derive an HTTP response. The module does not create an HTTP response,
serialize an error body, or validate that a code is a standard status.

#### Current implementation

The following code is the current module implementation.

```ts
export class HttpError extends Error {
    [property: string]: unknown

    public static readonly messages: { [code: number]: string } = Object.freeze({
        400: 'Bad Request',
        401: 'Unauthorized',
        402: 'Payment Required',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        407: 'Proxy Authentication Required',
        408: 'Request Timeout',
        409: 'Conflict',
        410: 'Gone',
        411: 'Length Required',
        412: 'Precondition Failed',
        413: 'Content Too Large',
        414: 'URI Too Long',
        415: 'Unsupported Media Type',
        416: 'Range Not Satisfiable',
        417: 'Expectation Failed',
        418: "I'm a teapot",
        421: 'Misdirected Request',
        422: 'Unprocessable Content',
        423: 'Locked',
        424: 'Failed Dependency',
        425: 'Too Early',
        426: 'Upgrade Required',
        428: 'Precondition Required',
        429: 'Too Many Requests',
        431: 'Request Header Fields Too Large',
        451: 'Unavailable For Legal Reasons',
        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
        505: 'HTTP Version Not Supported',
        506: 'Variant Also Negotiates',
        507: 'Insufficient Storage',
        508: 'Loop Detected',
        510: 'Not Extended',
        511: 'Network Authentication Required'
    })

    public readonly code: number

    constructor(code: number, message?: string) {
        super(message ?? HttpError.messages[code] ?? 'Unknown Error')
        this.code = code
        this.name = 'HttpError'
    }
}
```

#### Example

Create an `HttpError` with a status code when application code must report an
HTTP failure. A custom message replaces the message associated with the code.

```ts
const error = new HttpError(404)
const errorCode = error.code
const errorMessage = error.message
```
