/**
 * @description
 */
export interface Validatable {
    isValid(): boolean

    validate(): unknown
}
