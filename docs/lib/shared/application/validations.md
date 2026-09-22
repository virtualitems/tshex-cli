### `lib/shared/application/validations.ts`

Validation determines whether an application input can continue through a use
case. Each input defines its own validity conditions and exposes the resulting
decision through `Validatable`.

#### Current implementation

The following code is the current implementation of `Validatable`.

```ts
export interface Validatable {
    isValid(): boolean
}
```

#### Example

A request validator receives a standard `Request` and delegates each validation
to a specialized validator. `isValid()` combines the validator results.

```ts
interface RequestPartValidator {
  isValid(request: Request): boolean
}

class RequestValidator implements Validatable {
  public constructor(
    public readonly request: Request
  ) {}

  protected validateHeaders(request: Request): boolean {}

  protected validateBody(request: Request): boolean {}

  public isValid(): boolean {
    if (this.validateHeaders(this.request) === false) {
      return false
    }

    if (this.validateBody(this.request) === false) {
      return false
    }

    return true
  }
}
```
