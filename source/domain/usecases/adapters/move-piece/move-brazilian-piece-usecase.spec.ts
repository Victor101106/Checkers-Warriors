import { createBrazilianBoardUseCase } from "../../factory/create-board-usecase-factory"
import { moveBrazilianPieceUseCase } from "../../factory/move-piece-usecase-factory"
import { Board } from "../../../entities/board/board"
import { Right } from "../../../../shared/either"
import { describe, it, expect } from "vitest"

describe('Find movement by quantity rule use case', () => {

    const boardOrError = createBrazilianBoardUseCase.execute()

    expect(boardOrError).instanceOf(Right)

    const board = boardOrError.value as Board
    
    it("should be able to move a piece on table", () => {

        moveBrazilianPieceUseCase.execute({
            startsAt: { column: 1, row: 2 },
            endsAt:   { column: 2, row: 3 },
            board: board
        })

        moveBrazilianPieceUseCase.execute({
            startsAt: { column: 2, row: 5 },
            endsAt:   { column: 3, row: 4 },
            board: board
        })

        moveBrazilianPieceUseCase.execute({
            startsAt: { column: 2, row: 1 },
            endsAt:   { column: 1, row: 2 },
            board: board
        })

        moveBrazilianPieceUseCase.execute({
            startsAt: { column: 4, row: 5 },
            endsAt:   { column: 5, row: 4 },
            board: board
        })


        moveBrazilianPieceUseCase.execute({
            startsAt: { column: 2, row: 3 },
            endsAt:   { column: 6, row: 3 },
            board: board
        })

        expect(board.hasPiece({ column: 6, row: 3 })).toBeTruthy()
        expect(board.hasPiece({ column: 1, row: 2 })).toBeTruthy()
        expect(board.hasPiece({ column: 2, row: 1 })).toBeFalsy()
        expect(board.hasPiece({ column: 2, row: 5 })).toBeFalsy()
        expect(board.hasPiece({ column: 3, row: 4 })).toBeFalsy()
        expect(board.hasPiece({ column: 4, row: 5 })).toBeFalsy()
        expect(board.hasPiece({ column: 5, row: 4 })).toBeFalsy()

    })

})