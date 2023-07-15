export class InvalidTurn extends Error {
    constructor() {
        super('The turn is invalid.')
        this.name = 'InvalidTurn'
    }
}