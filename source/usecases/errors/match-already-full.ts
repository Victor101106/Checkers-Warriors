export class MatchAlreadyFull extends Error {
    constructor() {
        super('The match is already full.')
        this.name = 'MatchAlreadyFull'
    }
}