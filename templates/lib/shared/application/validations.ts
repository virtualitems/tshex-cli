/**
 * @description
 */
export interface Validatable {
    [property: string]: unknown

    isValid(): boolean

    validate(): unknown
}
