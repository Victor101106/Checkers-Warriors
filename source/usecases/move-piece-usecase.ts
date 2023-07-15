import { InvalidOrientation } from "../domain/board/errors/invalid-orientation"
import { InvalidPosition } from "../domain/board/errors/invalid-position"
import { InvalidRange } from "../domain/board/errors/invalid-range"
import { InvalidMovement } from "./errors/invalid-movement"
import { Position } from "../domain/board/types/position"
import { Jump } from "../domain/board/types/jump"
import { Board } from "../domain/board/board"
import { Either } from "../shared/either"

export interface MovePieceRequest {
    startsAt: Position
    endsAt: Position
    board: Board
}

export interface MovePieceResponse {
    positions: Array<Position>
    startsAt: Position
    promoted: boolean
    endsAt: Position
    jumps: Array<Jump>
}

export interface MovePieceUseCase {
    execute(request: MovePieceRequest): Either<InvalidPosition | InvalidRange | InvalidOrientation | InvalidMovement, MovePieceResponse>
}