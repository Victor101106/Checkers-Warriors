import { InvalidMeasure } from "./errors/invalid-measure"
import { Left, Right } from "../../../@shared/either"
import { describe, expect, it } from "vitest"
import { Board } from "./board"
import { Piece } from "./piece"

describe('Board domain', () => {

    it('should be able to create a 2d array', () => {

        const array = Board.create2DArray(8, 8)

        expect(array.length).toBe(8)

        for (let index = 0; index < 8; index++)
            expect(array[index].length).toBe(8)

    })

    it('should be able to create a board with valid measure', () => {

        const object = Board.create({ columns: 8, rows: 8 })

        expect(object).instanceOf(Right)

        if (object.isRight())
            expect(object.value).instanceOf(Board)

    })

    it('should not be able to create a board with invalid measure', () => {

        const object = Board.create({ columns: 8, rows: -1 })

        expect(object).instanceOf(Left)

        if (object.isLeft())
            expect(object.value).instanceOf(InvalidMeasure)

    })

    it('should be able to set and get a spot on board', () => {

        const boardOrError = Board.create({ columns: 8, rows: 8 })
        const pieceOrError = Piece.create({
            orientations: { column: [], row: [] },
            player: 0,
            range: 1
        })
        
        if (boardOrError.isLeft() || pieceOrError.isLeft())
            return
        
        const [ board, piece ] = [ boardOrError.value, pieceOrError.value ]
        const position = { column: 1, row: 2 }

        const confirmSet = board.setSpot(position, piece)

        expect(confirmSet).instanceOf(Right)
        expect(board.hasPiece(position)).toBeTruthy()

        const spotOrError = board.getSpot(position)

        expect(spotOrError).instanceOf(Right)
        expect(spotOrError.value).toBe(piece)

    })

    it('should be able to set and delete a spot on board', () => {

        const boardOrError = Board.create({ columns: 8, rows: 8 })
        const pieceOrError = Piece.create({
            orientations: { column: [], row: [] },
            player: 0,
            range: 1
        })
        
        if (boardOrError.isLeft() || pieceOrError.isLeft())
            return
        
        const [ board, piece ] = [ boardOrError.value, pieceOrError.value ]
        const position = { column: 1, row: 2 }

        const confirmSet = board.setSpot(position, piece)

        expect(confirmSet).instanceOf(Right)
        expect(board.hasPiece(position)).toBeTruthy()

        const confirmDelete = board.deleteSpot(position)

        expect(confirmDelete).instanceOf(Right)
        expect(board.hasPiece(position)).toBeFalsy()

    })

    it('should be able to set, get and swap a spot on board', () => {

        const boardOrError = Board.create({ columns: 8, rows: 8 })
        const piece1OrError = Piece.create({
            orientations: { column: [], row: [] },
            player: 0,
            range: 1
        })

        const piece2OrError = Piece.create({
            orientations: { column: [], row: [] },
            player: 1,
            range: 1
        })
        
        if (boardOrError.isLeft() || piece1OrError.isLeft() || piece2OrError.isLeft())
            return
        
        const [ board, piece1, piece2 ] = [ boardOrError.value, piece1OrError.value, piece2OrError.value ]

        const position1 = { column: 1, row: 2}
        const position2 = { column: 5, row: 6 }

        const confirmSet1 = board.setSpot(position1, piece1)
        const confirmSet2 = board.setSpot(position2, piece2)

        expect(confirmSet1).instanceOf(Right)
        expect(confirmSet2).instanceOf(Right)

        const confirmSwap = board.swapSpot(position1, position2)

        expect(confirmSwap).instanceOf(Right)
        
        const spot1OrUndefinedOrError = board.getSpot(position1)
        const spot2OrUndefinedOrError = board.getSpot(position2)

        expect(spot1OrUndefinedOrError).instanceOf(Right)
        expect(spot2OrUndefinedOrError).instanceOf(Right)

        const [ spot1, spot2 ] = [ spot1OrUndefinedOrError.value, spot2OrUndefinedOrError.value ]

        expect(spot1).toBe(piece2)
        expect(spot2).toBe(piece1)
        
    })

    it('should be able to set a spot and clone a board', () => {

        const boardOrError = Board.create({ columns: 8, rows: 8 })
        const pieceOrError = Piece.create({
            orientations: { column: [], row: [] },
            player: 0,
            range: 1
        })
        
        if (boardOrError.isLeft() || pieceOrError.isLeft())
            return
        
        const [ board, piece ] = [ boardOrError.value, pieceOrError.value ]
        const position = { column: 1, row: 2}

        const confirmSet = board.setSpot(position, piece)
        expect(confirmSet).instanceOf(Right)

        const clone = board.cloneBoard()
        expect(clone).instanceOf(Board)
        expect(clone.hasPiece(position)).toBeTruthy()

        const spotOrError = clone.getSpot(position)
        expect(spotOrError).instanceOf(Right)
        expect(spotOrError.value).toBe(piece)

    })

})