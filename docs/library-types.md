### Library Types

The generated root type `Generic<T>` represents a plain object whose keys are
strings and whose values share the same type.
It provides a small common building block for code that works with object-like
data but does not need a more specific shape yet.

#### Root Declaration

The root declaration lives in `index.d.ts`.

```ts title="index.d.ts"
type Generic<T = unknown> = Record<string, T>
```

This alias expands to `Record<string, T>`. When no type argument is provided,
the values use `unknown`.

#### Basic Usage

In the following example we use `Generic<string>` for a set of plain filters.

```ts
const filters: Generic<string> = {
    status: 'active',
    sort: 'email',
}
```

`filters` can only store string values because the type argument fixes the
value shape for the whole object.

#### Default Type Argument

Now consider the same pattern without providing a type argument.

```ts
const metadata: Generic = {
    retries: 2,
    cached: true,
}
```

In this case the values use `unknown`. This is useful when the object is plain
and open-ended, but the caller must narrow each value before using it in a
specific way.

#### When To Use It

Use `Generic<T>` when the code needs a simple object contract and the exact set
of keys is not the main concern.

Typical uses include:

1. filter objects;
2. metadata objects;
3. plain configuration maps;
4. transport-neutral dictionaries.

When the object has a stable business meaning, prefer a named type instead of a
generic record.

> **Hint**
> `Generic<T>` is intentionally small. It should support loose object contracts,
> not replace explicit domain or application types.

#### Next Step

For the rest of the generated shared abstractions, continue with the pages in
`shared/application` and `shared/domain`.