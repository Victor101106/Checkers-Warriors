import { FindMovementResponse, FindMovementUseCase } from "./find-movement-usecase"
import { InvalidPosition } from "../domain/board/errors/invalid-position"
import { Position } from "../domain/board/types/position"
import { Either, left, right } from "../shared/either"
import { Node } from "../domain/board/types/node"
import { Board } from "../domain/board/board"

export interface FindCorrectMovementRequest {
    nodes: Array<Node>
    startsAt: Position
    board: Board
}

export class FindCorrectMovementUseCase {

    private readonly findMovementUseCase: FindMovementUseCase

    constructor(findMovementUseCase: FindMovementUseCase) {
        this.findMovementUseCase = findMovementUseCase
    }

    execute({ startsAt, nodes, board }: FindCorrectMovementRequest): Either<InvalidPosition, FindMovementResponse> {

        const pieceOrError = board.getSpot(startsAt)
        
        if (pieceOrError.isLeft() || !pieceOrError.value)
            return left(new InvalidPosition())

        const piece = pieceOrError.value

        const movements = this.findMovementUseCase.execute(nodes)        
        const correctMovements = movements.filter(movement => {

            const hasColumnOrientation = movement.positions.length && piece.orientations.column.has((movement.positions[0].column - startsAt.column) < 0 ? -1 : 1)
            const hasRowOrientation = movement.positions.length && piece.orientations.row.has((movement.positions[0].row - startsAt.row) < 0 ? -1 : 1)

            return movement.jumps.length || (hasColumnOrientation && hasRowOrientation)

        })

        return right(correctMovements)

    }

}