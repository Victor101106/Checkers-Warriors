import { Jump } from "../../../domain/entities/board/types/jump"
import { PiecePresenter } from "./piece-presenter"

export class JumpPresenter {

    static toJSON(jump: Jump) {
        return {
            piece: PiecePresenter.toJSON(jump.piece),
            position: jump.position
        }
    }

}