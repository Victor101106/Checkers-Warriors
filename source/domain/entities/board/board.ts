import { InvalidPosition } from "./errors/invalid-position"
import { InvalidMeasure } from "./errors/invalid-measure"
import { Either, left, right } from "../../../@shared/either"
import { Position } from "./types/position"
import { Piece } from "./piece"

export interface BoardRequest {
    columns: number
    rows: number
}

export class Board {

    public readonly spots: (Piece | undefined)[][]
    public readonly columns: number
    public readonly rows: number

    private constructor(columns: number, rows: number) {
        this.columns = columns
        this.spots   = Board.create2DArray(columns, rows)
        this.rows    = rows
    }

    static create(request: BoardRequest): Either<InvalidMeasure, Board> {

        const isInvalidMeasure = !this.validateMeasure(request.columns, request.rows)

        if (isInvalidMeasure)
            return left(new InvalidMeasure())
        
        return right(new Board(request.columns, request.rows))

    }

    static create2DArray(columns: number, rows: number) {
        const  array = new Array(rows).fill(undefined) 
        return array.map(() => new Array<Piece | undefined>(columns).fill(undefined))
    }

    static validateMeasure(column: number, row: number): boolean {
        return column > 0 && row > 0
    }

    validatePosition(position: Position): boolean {
        
        const isValidColumn = position.column >= 0 && position.column < this.columns
        const isValidRow = position.row >= 0 && position.row < this.rows
        
        return isValidColumn && isValidRow

    }

    setSpot(position: Position, piece: Piece): Either<InvalidPosition, void> {

        const isInvalidPosition = !this.validatePosition(position)

        if (isInvalidPosition)
            return left(new InvalidPosition())

        this.spots[position.row][position.column] = piece

        return right(undefined)

    }

    swapSpot(position1: Position, position2: Position): Either<InvalidPosition, void> {

        const isInvalidPosition1 = !this.validatePosition(position1)
        const isInvalidPosition2 = !this.validatePosition(position2)

        if (isInvalidPosition1 || isInvalidPosition2)
            return left(new InvalidPosition())

        const swapPieceOrUndefined = this.spots[position1.row][position1.column]

        this.spots[position1.row][position1.column] = this.spots[position2.row][position2.column]
        this.spots[position2.row][position2.column] = swapPieceOrUndefined

        return right(undefined)

    }
    
    deleteSpot(position: Position): Either<InvalidPosition, Piece | void> {
        
        const isInvalidPosition = !this.validatePosition(position)

        if (isInvalidPosition)
            return left(new InvalidPosition())

        const pieceOrUndefined = this.spots[position.row][position.column]

        this.spots[position.row][position.column] = undefined

        return right(pieceOrUndefined)

    }
    
    getSpot(position: Position): Either<InvalidPosition, Piece | void> {
        
        const isInvalidPosition = !this.validatePosition(position)

        if (isInvalidPosition)
            return left(new InvalidPosition())

        return right(this.spots[position.row][position.column])

    }

    hasPiece(position: Position): boolean {
        
        const isInvalidPosition = !this.validatePosition(position)

        if (isInvalidPosition)
            return false
        
        const pieceOrUndefined = this.spots[position.row][position.column]

        return pieceOrUndefined != undefined

    }

    cloneBoard(): Board {
        
        const clone: Board = Board.create({ columns: this.columns, rows: this.rows }).value as Board

        this.spots.forEach((array, row) => array.forEach((piece, column) => {
            piece && clone.setSpot({ column, row }, piece)
        }))

        return clone

    }

}