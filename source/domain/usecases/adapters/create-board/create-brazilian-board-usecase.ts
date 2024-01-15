import { InvalidOrientation } from "../../../entities/board/errors/invalid-orientation"
import { InvalidPosition } from "../../../entities/board/errors/invalid-position"
import { InvalidMeasure } from "../../../entities/board/errors/invalid-measure"
import { InvalidRange } from "../../../entities/board/errors/invalid-range"
import { CreateBoardUseCase } from "../../create-board-usecase"
import { Either, left, right } from "../../../../shared/either"
import { Board } from "../../../entities/board/board"
import { Piece } from "../../../entities/board/piece"

export class CreateBrazilianBoardUseCase implements CreateBoardUseCase {

    public readonly pieceCount: number = 24
    public readonly columns: number = 8
    public readonly rows: number = 8

    execute(): Either<InvalidMeasure | InvalidPosition | InvalidRange | InvalidOrientation, Board> {
        
        const boardOrError = Board.create({
            columns: this.columns,
            rows: this.rows
        })

        if (boardOrError.isLeft())
            return left(boardOrError.value)

        const validSpots = Math.floor(this.columns * this.rows / 2)
        const board = boardOrError.value

        let spotCounter = 0

        for (let row = 0; row < board.rows; row++) {
            
            for (let column = 0; column < board.columns; column++) {

                const isValidSpot = (column + row) % 2 != 0

                if (isValidSpot) {

                    let player: -1 | 0 | 1 = spotCounter < this.pieceCount / 2 ? 0 : spotCounter >= validSpots - this.pieceCount / 2 ? 1 : -1

                    if (player != -1) {

                        const pieceOrError = Piece.create({
                            orientations: { column: [-1, 1], row: [player == 0 ? 1 : -1] },
                            player: player,
                            range: 1,
                        })

                        if (pieceOrError.isLeft())
                            return left(pieceOrError.value)
                        
                        const piece = pieceOrError.value

                        const confirm = board.setSpot({ column, row }, piece)

                        if(confirm.isLeft())
                            return left(confirm.value)

                    }

                    spotCounter++

                }

            }

        }

        return right(board)

    }

}