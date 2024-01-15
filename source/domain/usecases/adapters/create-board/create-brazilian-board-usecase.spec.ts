import { createBrazilianBoardUseCase } from "../../../../main/factories/domain/usecases/create-board-usecase-factory"
import { Board } from "../../../entities/board/board"
import { Piece } from "../../../entities/board/piece"
import { Right } from "../../../../shared/either"
import { describe, expect, it } from "vitest"

describe('Create brazilian board use case', () => {

    const { columns, rows, pieceCount } = createBrazilianBoardUseCase

    it('should be able to create a brazilian board', () => {

        const boardOrError = createBrazilianBoardUseCase.execute()

        expect(boardOrError).instanceOf(Right)
        expect(boardOrError.value).instanceOf(Board)

        const board = boardOrError.value as Board
        const validSpots = board.columns * board.rows / 2

        let spotCounter = 0

        for (let row = 0; row < rows; row++) {
            
            for (let column = 0; column < columns; column++) {
                
                const isValidSpot = (column + row) % 2 != 0

                if (isValidSpot) {
                    
                    let player: -1 | 0 | 1 = spotCounter < pieceCount / 2 ? 0 : spotCounter >= validSpots - pieceCount / 2 ? 1 : -1

                    if (player != -1) {
                        
                        const pieceOrError = board.getSpot({ column, row })

                        expect(pieceOrError).instanceOf(Right)
                        expect(pieceOrError.value).instanceOf(Piece)

                        const piece = pieceOrError.value as Piece

                        expect(piece.orientations.row.has(player == 0 ? 1 : -1)).toBeTruthy()
                        expect(piece.orientations.row.has(player == 1 ? 1 : -1)).toBeFalsy()
                        expect(piece.range.value).toBe(1)
                        expect(piece.player).toBe(player)

                    }

                    spotCounter++

                }

            }

        }

    })

})