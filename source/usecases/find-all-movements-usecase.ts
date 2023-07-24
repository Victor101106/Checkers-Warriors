import { InvalidPosition } from "../domain/board/errors/invalid-position"
import { Position } from "../domain/board/types/position"
import { Player } from "../domain/board/types/player"
import { Jump } from "../domain/board/types/jump"
import { Board } from "../domain/board/board"
import { Either } from "../shared/either"

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