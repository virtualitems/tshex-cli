### `lib/shared/application/validations.ts`

`Validatable` is an interface for an object that reports its validation state
through `isValid()`.

#### Validate application input

```ts
class CreateUserInput implements Validatable {
    public constructor(public readonly name: string) {}

    public isValid(): boolean {
        return this.name.trim() !== ''
    }
}
```

The interface returns only a Boolean. It does not define error messages,
validation order, asynchronous checks, or normalization.
