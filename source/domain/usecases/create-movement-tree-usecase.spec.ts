import { createMovementTreeUseCase } from "../../main/factories/domain/usecases/create-movement-tree-usecase-factory"
import { createBrazilianBoardUseCase } from "../../main/factories/domain/usecases/create-board-usecase-factory"
import { Direction } from "../entities/board/types/direction"
import { Board } from "../entities/board/board"
import { describe, it, expect } from "vitest"
import { Right } from "../../@shared/either"

describe('Create movement tree use case', () => {

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

    const straightDirections: Array<Direction> = [
        { column:  0, row:  1},
        { column:  0, row: -1},
        { column:  1, row:  0},
        { column: -1, row:  0}
    ]

    it('should be able to create a movement tree with diagonal directions', () => {

        const movementTreeOrError = createMovementTreeUseCase.execute({
            allowedDirections: diagonalDirections,
            startsAt: position,
            board: board,
        })
        
        expect(movementTreeOrError).instanceOf(Right)
        
        if (movementTreeOrError.isLeft())
            return
        
        const movementTree = movementTreeOrError.value

        expect(movementTree.length).toBe(2)

    })

    it('should be able to create a movement tree with straight directions', () => {

        const movementTreeOrError = createMovementTreeUseCase.execute({
            allowedDirections: straightDirections,
            startsAt: position,
            board: board,
        })
        
        expect(movementTreeOrError).instanceOf(Right)
        
        if (movementTreeOrError.isLeft())
            return
        
        const movementTree = movementTreeOrError.value

        expect(movementTree.length).toBe(4)

    })

})