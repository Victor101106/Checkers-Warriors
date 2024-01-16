export class RequiredFieldError extends Error {
    constructor (field: string) {
        super(`The field ${field} is required`)
        this.name = 'RequiredFieldError'
    }
}