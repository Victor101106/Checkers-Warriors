import { Board } from "../../../domain/entities/board/board"
import { PiecePresenter } from "./piece-presenter"

export class BoardPresenter {

    static toJSON(board: Board) {
        return {
            spots: board.spots.map(array => array.map(piece => piece ? PiecePresenter.toJSON(piece) : undefined)),
            columns: board.columns,
            rows: board.rows,
        }
    }

}