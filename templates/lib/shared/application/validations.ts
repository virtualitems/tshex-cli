/**
 * @description Contract for objects that can report their own validation state.
 */
export interface Validatable {
    isValid(): boolean
}
