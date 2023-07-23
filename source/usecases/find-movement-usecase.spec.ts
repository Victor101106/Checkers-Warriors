import { describe, it, expect } from "vitest"
import { CreateBrazilianBoardUseCase } from "./adapters/create-board/create-brazilian-board-usecase"
import { CreateTrajectoryUseCase } from "./create-trajectory-usecase"
import { CreateMovementTreeUseCase } from "./create-movement-tree-usecase"
import { FindMovementUseCase } from "./find-movement-usecase"
import { Right } from "../shared/either"
import { Board } from "../domain/board/board"
import { Direction } from "../domain/board/types/direction"

describe('Find movement by quantity rule use case', () => {

    const createBrazilianBoardUseCase = new CreateBrazilianBoardUseCase()
    const createTrajectoryUseCase = new CreateTrajectoryUseCase()
    const createMovementTreeUseCase = new CreateMovementTreeUseCase(createTrajectoryUseCase)
    const findMovementUseCase = new FindMovementUseCase()
    
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