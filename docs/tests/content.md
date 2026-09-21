### `tests/content.ts`

`content.ts` is the source copied into every missing TypeScript test file that
`tshex --tests <path>` creates. It provides one `node:test` suite and one
strict assertion.

#### Adapt the generated suite

Replace the `math` suite with the test for the source module at the matching
path. Keep the arrange, act, and assert sections when they describe the test
steps.

#### Starter assertion

The starter assertion evaluates `2 * 3` and expects `6`. It does not import or
exercise the source file that receives the generated test file.
