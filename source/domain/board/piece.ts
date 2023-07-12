import { Either, left, right } from "../../shared/either"
import { InvalidRange } from "./errors/invalid-range"
import { Orientations } from "./types/orientations"
import { Orientation } from "./types/orientation"
import { Player } from "./types/player"
import { Range } from "./range"

export interface PieceRequest {
    orientations: {
        column: Orientation[]
        row: Orientation[]
    },
    player: Player
    range: number
}

export class Piece {

    public readonly orientations: Orientations
    public readonly player: Player
    public readonly range: Range

    private constructor(orientations: Orientations, player: Player, range: Range) {
        this.orientations = orientations
        this.player = player
        this.range = range
        Object.freeze(this)
    }

    static create(request: PieceRequest): Either<InvalidRange, Piece> {

        const rangeOrError = Range.create(request.range)

        if (rangeOrError.isLeft())
            return left(rangeOrError.value)
        
        const range = rangeOrError.value
        const player = request.player
        const orientations = {
            column: new Set(request.orientations.column),
            row: new Set(request.orientations.row)
        }

        return right(new Piece(orientations, player, range))

    }

}