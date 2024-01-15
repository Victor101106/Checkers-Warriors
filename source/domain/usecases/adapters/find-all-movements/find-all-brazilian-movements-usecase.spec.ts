import { findAllBrazilianMovementsUseCase } from "../../factory/find-all-movements-usecase-factory"
import { createBrazilianBoardUseCase } from "../../factory/create-board-usecase-factory"
import { FindAllMovementsResponse } from "../../find-all-movements-usecase"
import { Direction } from "../../../entities/board/types/direction"
import { Board } from "../../../entities/board/board"
import { describe, it, expect } from "vitest"
import { Right } from "../../../../shared/either"

describe('Find all brazilian movements use case', () => {

    const boardOrError = createBrazilianBoardUseCase.execute()

    expect(boardOrError).instanceOf(Right)

    const board = boardOrError.value as Board
    
    it("should be able to find all player's correct movements tree (player 0)", () => {

        const correctMovementsOrError = findAllBrazilianMovementsUseCase.execute({
            board: board,
            player: 0
        })

        expect(correctMovementsOrError).instanceOf(Right)

        const correctMovements = correctMovementsOrError.value as FindAllMovementsResponse

        expect(correctMovements.length).toBe(7)

    })

    it("should be able to find all player's correct movements tree (player 1)", () => {

        const correctMovementsOrError = findAllBrazilianMovementsUseCase.execute({
            board: board,
            player: 1
        })

        expect(correctMovementsOrError).instanceOf(Right)

        const correctMovements = correctMovementsOrError.value as FindAllMovementsResponse

        expect(correctMovements.length).toBe(7)

    })

})