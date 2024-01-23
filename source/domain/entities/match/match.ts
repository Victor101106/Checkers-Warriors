import { Either, left, right } from "../../../@shared/either"
import { InvalidId } from "../user/errors/invalid-id"
import { Player } from "../board/types/player"
import { Variation } from "./types/variation"
import { Movement } from "./types/movement"
import { Board } from "../board/board"
import { User } from "../user/user"
import { Id } from "../user/id"

export interface MatchRequest {
    movements: Movement[]
    variation: Variation
    players: [ User, User? ]
    score?: [number, number]
    createdAt?: Date
    winner?: Player
    turn?: Player
    board: Board
    id?: string
}

export class Match {

    public readonly movements: Movement[]
    public readonly variation: Variation
    public readonly players: [ User, User? ]
    public readonly score: [ number, number ]
    public readonly createdAt: Date
    public          winner?: Player
    public readonly board: Board
    public          turn: Player
    public readonly id: Id

    private constructor(movements: Movement[], variation: Variation, createdAt: Date, players: [ User, User? ], score: [number, number], board: Board, turn: Player, id: Id, winner?: Player) {
        this.movements = movements
        this.variation = variation
        this.createdAt = createdAt
        this.players = players
        this.winner = winner
        this.score = score
        this.board = board
        this.turn = turn
        this.id = id
    }

    static create({ movements, variation, createdAt, players, score, board, turn, id, winner }: MatchRequest): Either<InvalidId, Match> {

        const idOrError = Id.create(id)

        if (idOrError.isLeft())
            return left(idOrError.value)
        
        return right(new Match(movements, variation, createdAt || new Date(), players, score || [0, 0], board, turn || 0, idOrError.value, winner))

    }

    public reverseTurn() {
        this.turn = this.turn == 0 ? 1 : 0
    }

}