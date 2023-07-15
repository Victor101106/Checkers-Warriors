export class InvalidMovement extends Error {
    constructor() {
        super('The movement is invalid.')
        this.name = 'InvalidMovement'
    }
}