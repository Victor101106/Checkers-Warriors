export class InvalidEmail extends Error {
    constructor() {
        super(`The email is invalid.`)
        this.name = 'InvalidEmail'
    }
}