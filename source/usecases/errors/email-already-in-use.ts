export class EmailAlreadyInUse extends Error {
    constructor() {
        super('The email is already in use.')
        this.name = 'EmailAlreadyInUse'
    }
}