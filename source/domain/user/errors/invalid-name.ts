export class InvalidName extends Error {
    constructor() {
        super(`The name is invalid.`)
        this.name = 'InvalidName'
    }
}