export class InvalidRange extends Error {
    constructor() {
        super(`The range is invalid.`)
        this.name = 'InvalidRange'
    }
}