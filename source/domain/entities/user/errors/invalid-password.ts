export class InvalidPassword extends Error {
    constructor() {
        super(`The password is invalid.`)
        this.name = 'InvalidPassword'
    }
}