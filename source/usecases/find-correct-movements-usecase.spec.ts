import { FindMovementByQuantityRuleUseCase } from "./adapters/find-movement-by-rule/find-movement-by-quantity-rule-usecase"
import { CreateBrazilianBoardUseCase } from "./adapters/create-board/create-brazilian-board-usecase"
import { FindCorrectMovementUseCase } from "./find-correct-movements-usecase"
import { FindMovementByRuleResponse } from "./find-movement-by-rule-usecase"
import { CreateMovementTreeUseCase } from "./create-movement-tree-usecase"
import { CreateTrajectoryUseCase } from "./create-trajectory-usecase"
import { Direction } from "../domain/board/types/direction"
import { Board } from "../domain/board/board"
import { describe, it, expect } from "vitest"
import { Right } from "../shared/either"

describe('Find movement by quantity rule use case', () => {

    const createBrazilianBoardUseCase = new CreateBrazilianBoardUseCase()
    const createTrajectoryUseCase = new CreateTrajectoryUseCase()
    const createMovementTreeUseCase = new CreateMovementTreeUseCase(createTrajectoryUseCase)
    const findMovementByQuantityRuleUseCase = new FindMovementByQuantityRuleUseCase()
    const findCorrectMovementUseCase = new FindCorrectMovementUseCase(findMovementByQuantityRuleUseCase)
    
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

        const correctMovementsOrError = findCorrectMovementUseCase.execute({
            startsAt: position,
            nodes: movementTree,
            board: board
        })

        expect(correctMovementsOrError).instanceOf(Right)

        const correctMovements = correctMovementsOrError.value as FindMovementByRuleResponse

        expect(correctMovements.length).toBe(2)

    })

})