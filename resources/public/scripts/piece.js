export class Piece {
    constructor({direction, distance, player, type}) {
        this.movement = {
            distance: Math.floor(Math.abs(distance)),
            direction
        }
        this.player = player
        this.type = type == 'lady' ? 'lady' : 'pawn'
    }
}