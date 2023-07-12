export class InvalidMeasure extends Error {
    constructor() {
        super(`The measure is invalid.`)
        this.name = 'InvalidMeasure'
    }
}