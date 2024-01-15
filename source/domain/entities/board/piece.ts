import { InvalidOrientation } from "./errors/invalid-orientation"
import { Either, left, right } from "../../../shared/either"
import { InvalidRange } from "./errors/invalid-range"
import { Orientations } from "./types/orientations"
import { Orientation } from "./types/orientation"
import { Player } from "./types/player"
import { Range } from "./range"

export interface PieceRequest {
    orientations: {
        column: Orientation[]
        row: Orientation[]
    }
    promoted?: boolean
    player: Player
    range: number
}

export class Piece {

    public readonly orientations: Orientations
    public readonly promoted: boolean
    public readonly player: Player
    public readonly range: Range

    private constructor(orientations: Orientations, promoted: boolean, player: Player, range: Range) {
        this.orientations = orientations
        this.promoted = promoted
        this.player = player
        this.range = range
        Object.freeze(this)
    }

    static create(request: PieceRequest): Either<InvalidRange | InvalidOrientation, Piece> {

        const rangeOrError = Range.create(request.range)

        if (rangeOrError.isLeft())
            return left(rangeOrError.value)
        
        const promoted = request.promoted || false
        const range = rangeOrError.value
        const player = request.player
        const orientations = {
            column: new Set(request.orientations.column),
            row: new Set(request.orientations.row)
        }

        const isInvalidColumnOrientation = !this.validateOrientation(orientations.column)
        const isInvalidRowOrientation = !this.validateOrientation(orientations.row)

        if (isInvalidColumnOrientation || isInvalidRowOrientation)
            return left(new InvalidOrientation())

        return right(new Piece(orientations, promoted, player, range))

    }

    static validateOrientation(orientation: Set<Orientation>): boolean {
        
        const hasSomeOrientation = orientation.size > 0
        const hasJustZero = orientation.size == 1 && orientation.has(0)
        
        return hasSomeOrientation && !hasJustZero

    }

}