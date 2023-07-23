import { FindCorrectMovementsUseCase } from "./find-correct-movements-usecase"
import { CreateMovementTreeUseCase } from "./create-movement-tree-usecase"
import { InvalidPosition } from "../domain/board/errors/invalid-position"
import { Direction } from "../domain/board/types/direction"
import { Position } from "../domain/board/types/position"
import { Either, left, right } from "../shared/either"
import { Player } from "../domain/board/types/player"
import { Jump } from "../domain/board/types/jump"
import { Board } from "../domain/board/board"

export interface FindAllPlayerCorrectMovementsRequest {
    directions: Array<Direction>
    player: Player
    board: Board
}

export type FindAllPlayerCorrectMovementsResponse = {
    positions: Array<Position>
    jumps: Array<Jump>
    startsAt: Position
    endsAt: Position
}[]

export class FindAllPlayerCorrectMovementsUseCase {

    private readonly findCorrectMovementsUseCase: FindCorrectMovementsUseCase
    private readonly createMovementTreeUseCase: CreateMovementTreeUseCase

    constructor(findCorrectMovementsUseCase: FindCorrectMovementsUseCase, createMovementTreeUseCase: CreateMovementTreeUseCase) {
        this.findCorrectMovementsUseCase = findCorrectMovementsUseCase
        this.createMovementTreeUseCase = createMovementTreeUseCase
    }

    execute({ player, board, directions }: FindAllPlayerCorrectMovementsRequest): Either<InvalidPosition, FindAllPlayerCorrectMovementsResponse> {
        
        let response: FindAllPlayerCorrectMovementsResponse = []
        let maximumJumps = 0

        for (let row = 0; row < board.rows; row++) { 

            for (let column = 0; column < board.columns; column++) {

                const startsAt = { column, row }
                const pieceOrUndefinedOrError = board.getSpot(startsAt)

                if (pieceOrUndefinedOrError.isRight() && pieceOrUndefinedOrError.value?.player == player) {

                    const nodesOrError = this.createMovementTreeUseCase.execute({
                        allowedDirections: directions,
                        startsAt: startsAt,
                        board: board
                    })

                    if (nodesOrError.isLeft())
                        return left(nodesOrError.value)

                    const nodes = nodesOrError.value

                    const correctMovementsOrError = this.findCorrectMovementsUseCase.execute({ startsAt, board, nodes })

                    if (correctMovementsOrError.isRight() && correctMovementsOrError.value.length) {
                        
                        const correctMovements = correctMovementsOrError.value
                        const object: FindAllPlayerCorrectMovementsResponse = []

                        correctMovements.forEach(
                            movement => object.push({ startsAt, ...movement })
                        )

                        if (object[0].jumps.length > maximumJumps) {
                            maximumJumps = object[0].jumps.length
                            response = [...object]
                        } else if (object[0].jumps.length == maximumJumps) {
                            response = [...response, ...object]
                        }

                    }

                }

            }

        }

        return right(response)

    }

}