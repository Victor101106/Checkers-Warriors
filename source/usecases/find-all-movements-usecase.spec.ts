import { findAllMovementsUseCase } from "./factory/find-all-movements-usecase-factory"
import { FindAllMovementsResponse } from "./find-all-movements-usecase"
import { createBrazilianBoardUseCase } from "./factory/create-board-usecase-factory"
import { Direction } from "../domain/board/types/direction"
import { Board } from "../domain/board/board"
import { describe, it, expect } from "vitest"
import { Right } from "../shared/either"

describe('Find movement by quantity rule use case', () => {

    const boardOrError = createBrazilianBoardUseCase.execute()

    expect(boardOrError).instanceOf(Right)

    const board = boardOrError.value as Board
    
    const diagonalDirections: Array<Direction> = [
        { column:  1, row:  1},
        { column: -1, row: -1},
        { column:  1, row: -1},
        { column: -1, row:  1}
    ]

    it("should be able to find all player's correct movements tree (player 0)", () => {

        const correctMovementsOrError = findAllMovementsUseCase.execute({
            directions: diagonalDirections,
            board: board,
            player: 0
        })

        expect(correctMovementsOrError).instanceOf(Right)

        const correctMovements = correctMovementsOrError.value as FindAllMovementsResponse

        expect(correctMovements.length).toBe(7)

    })

    it("should be able to find all player's correct movements tree (player 1)", () => {

        const correctMovementsOrError = findAllMovementsUseCase.execute({
            directions: diagonalDirections,
            board: board,
            player: 1
        })

        expect(correctMovementsOrError).instanceOf(Right)

        const correctMovements = correctMovementsOrError.value as FindAllMovementsResponse

        expect(correctMovements.length).toBe(7)

    })

})