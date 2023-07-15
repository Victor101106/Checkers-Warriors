import { Either, left, right } from "../../shared/either"
import { InvalidId } from "../user/errors/invalid-id"
import { Player } from "../board/types/player"
import { Variation } from "./types/variation"
import { Board } from "../board/board"
import { Id } from "../user/id"

export interface MatchRequest {
    variation: Variation
    players: [ Id, Id? ]
    createdAt?: Date
    turn?: Player
    board: Board
    id?: string
}

export class Match {

    public readonly variation: Variation
    public readonly players: [ Id, Id? ]
    public readonly createdAt: Date
    public readonly board: Board
    public          turn: Player
    public readonly id: Id

    private constructor(variation: Variation, createdAt: Date, players: [ Id, Id? ], board: Board, turn: Player, id: Id) {
        this.variation = variation
        this.createdAt = createdAt
        this.players = players
        this.board = board
        this.turn = turn
        this.id = id
    }

    static create({ variation, createdAt, players, board, turn, id }: MatchRequest): Either<InvalidId, Match> {

        const idOrError = Id.create(id)

        if (idOrError.isLeft())
            return left(idOrError.value)
        
        return right(new Match(variation, createdAt || new Date(), players, board, turn || 0, idOrError.value))

    }

    public reverseTurn() {
        this.turn = this.turn == 0 ? 1 : 0
    }

}