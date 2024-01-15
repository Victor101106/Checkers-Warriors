export class InvalidToken extends Error {
    constructor() {
        super('The token is invalid.')
        this.name = 'InvalidToken'
    }
}