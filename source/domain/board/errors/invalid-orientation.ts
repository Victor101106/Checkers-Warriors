export class InvalidOrientation extends Error {
    constructor() {
        super(`The orientation is invalid.`)
        this.name = 'InvalidOrientation'
    }
}