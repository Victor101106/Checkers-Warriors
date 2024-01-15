export class InvalidId extends Error {
    constructor() {
        super(`The id is invalid.`)
        this.name = 'InvalidId'
    }
}