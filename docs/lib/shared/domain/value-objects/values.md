### `lib/shared/domain/value-objects/values.ts`

`ValueObject<T>` is the abstract base class for a typed domain value with a
string representation, JSON representation, and equality operation.

#### Define a value rule

```ts
class Currency extends ValueObject<string> {
    public constructor(public readonly value: string) { super() }

    public equals(other: Currency | null | undefined): boolean {
        return other !== null && other !== undefined && this.value === other.value
    }
}
```

`ValueObject.isValid()` rejects `null`, `undefined`, and `NaN`. It does not
validate any domain-specific format, and each concrete value must implement
`equals()`.
