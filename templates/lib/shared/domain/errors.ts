/**
 * @description Represents a received value that does not satisfy the rule expected by a domain concept.
 */
export class ValueError extends Error {
    [property: string]: unknown

    public constructor(received: string, expected: string) {
        super(`Invalid value ${received} for ${expected}.`)
    }
} //:: class
