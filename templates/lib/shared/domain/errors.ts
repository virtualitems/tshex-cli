/**
 * @description
 */
export class ValueError extends Error {
    [property: string]: unknown

    public constructor(received: string, expected: string) {
        super(`Invalid value ${received} for ${expected}.`)
    }
} //:: class
