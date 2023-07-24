export class InvalidParameters extends Error {
    constructor() {
        super(`The parameters is invalid.`)
        this.name = 'InvalidParameters'
    }
}