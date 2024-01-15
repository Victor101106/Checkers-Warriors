import { InvalidPosition } from "../entities/board/errors/invalid-position"
import { Position } from "../entities/board/types/position"
import { Player } from "../entities/board/types/player"
import { Jump } from "../entities/board/types/jump"
import { Board } from "../entities/board/board"
import { Either } from "../../shared/either"

export interface FindAllMovementsRequest {
    player: Player
    board: Board
}

export type FindAllMovementsResponse = {
    positions: Array<Position>
    jumps: Array<Jump>
    startsAt: Position
    endsAt: Position
}[]

export interface FindAllMovementsUseCase {
    execute(request: FindAllMovementsRequest): Either<InvalidPosition, FindAllMovementsResponse>
}