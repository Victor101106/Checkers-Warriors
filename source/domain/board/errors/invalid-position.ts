export class InvalidPosition extends Error {
    constructor() {
        super(`The position is invalid.`)
        this.name = 'InvalidPosition'
    }
}