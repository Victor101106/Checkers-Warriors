export class VariationNotFound extends Error {
    constructor() {
        super('Variation not found.')
        this.name = 'VariationNotFound'
    }
}