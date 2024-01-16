export class FieldTypeError extends Error {
    constructor (field: string) {
        super(`The type of field ${field} is incompatible`)
        this.name = 'RequiredFieldError'
    }
}