### `lib/shared/domain/value-objects/errors.ts`

`ValueError` reports a value rejected by a value object's validation rule. Its
constructor receives the rejected string and the expected value-object name.

#### Handle invalid input

```ts
try {
    Email.from('invalid')
} catch (error) {
    if (error instanceof ValueError) {
        console.log(error.message)
    }
}
```

`ValueError` only carries the generated message. It does not store a field
name, validation code, HTTP status, or cause.
