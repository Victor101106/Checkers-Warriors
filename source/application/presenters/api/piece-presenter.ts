import { Piece } from "../../../domain/entities/board/piece"

export class PiecePresenter {

    static toJSON(piece: Piece) {
        return {
            promoted: piece.promoted,
            orientations: {
                column: [...piece.orientations.column],
                row: [...piece.orientations.row]
            },
            range: piece.range.value,    
            player: piece.player
        }
    }

}