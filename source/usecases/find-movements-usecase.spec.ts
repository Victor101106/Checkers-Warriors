import { createMovementTreeUseCase } from "./factory/create-movement-tree-usecase-factory"
import { findMovementsUseCase } from "./factory/find-movements-usecase-factory"
import { createBrazilianBoardUseCase } from "./factory/create-board-usecase-factory"
import { FindMovementsResponse } from "./find-movements-usecase"
import { Direction } from "../domain/board/types/direction"
import { Board } from "../domain/board/board"
import { describe, it, expect } from "vitest"
import { Right } from "../shared/either"

describe('Find movement by quantity rule use case', () => {

    const boardOrError = createBrazilianBoardUseCase.execute()

    expect(boardOrError).instanceOf(Right)

    const board = boardOrError.value as Board
    const position = { column: 1, row: 2 }

    const diagonalDirections: Array<Direction> = [
        { column:  1, row:  1},
        { column: -1, row: -1},
        { column:  1, row: -1},
        { column: -1, row:  1}
    ]

    const movementTreeOrError = createMovementTreeUseCase.execute({
        allowedDirections: diagonalDirections,
        startsAt: position,
        board: board,
    })
    
    expect(movementTreeOrError).instanceOf(Right)

    if (movementTreeOrError.isLeft())
        return
    
    const movementTree = movementTreeOrError.value

    it('should be able to find a correct movement in movement tree', () => {

        const correctMovementsOrError = findMovementsUseCase.execute({
            startsAt: position,
            nodes: movementTree,
            board: board
        })

        expect(correctMovementsOrError).instanceOf(Right)

        const correctMovements = correctMovementsOrError.value as FindMovementsResponse

        expect(correctMovements.length).toBe(2)

    })

})