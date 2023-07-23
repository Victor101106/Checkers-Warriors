import { createMovementTreeUseCase } from "./factory/create-movement-tree-usecase-factory"
import { createBrazilianBoardUseCase } from "./factory/create-board-usecase-factory"
import { findMovementUseCase } from "./factory/find-movement-usecase-factory"
import { Direction } from "../domain/board/types/direction"
import { describe, it, expect } from "vitest"
import { Board } from "../domain/board/board"
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

    it('should be able to create a movement tree with diagonal directions', () => {

        const movements = findMovementUseCase.execute(movementTree)

        expect(movements.length).toBe(2)

    })

})