import { Match } from "../../../domain/entities/match/match"
import { MovementPresenter } from "./movement-presenter"
import { BoardPresenter } from "./board-presenter"

export class MatchPresenter {

    static toJSON(match: Match) {
        return {
            board: BoardPresenter.toJSON(match.board),
            score: match.score,
            players: [
                match.players[0]?.name.value,
                match.players[1]?.name.value
            ],
            movements: match.movements.map(movement => MovementPresenter.toJSON(movement)),
            createdAt: match.createdAt.toUTCString(),
            winner: match.winner,
            turn: match.turn
        }
    }

}