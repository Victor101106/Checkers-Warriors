import { InvalidOrientation } from "../entities/board/errors/invalid-orientation"
import { InvalidPosition } from "../entities/board/errors/invalid-position"
import { InvalidRange } from "../entities/board/errors/invalid-range"
import { InvalidMovement } from "./errors/invalid-movement"
import { Movement } from "../entities/match/types/movement"
import { Position } from "../entities/board/types/position"
import { Board } from "../entities/board/board"
import { Either } from "../../@shared/either"

export interface MovePieceRequest {
    startsAt: Position
    endsAt: Position
    board: Board
}

export interface MovePieceUseCase {
    execute(request: MovePieceRequest): Either<InvalidPosition | InvalidRange | InvalidOrientation | InvalidMovement, Movement>
}