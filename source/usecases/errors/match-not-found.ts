export class MatchNotFound extends Error {
    constructor() {
        super('Match not found.')
        this.name = 'MatchNotFound'
    }
}