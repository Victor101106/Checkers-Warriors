import { GetUserByHttpCookieUseCase } from "../../../usecases/get-user-by-http-cookie-usecase"
import { HttpRequestHeaders } from "../../../adapters/controllers/ports/http-headers"
import { CreateRelationUseCase } from "../../../usecases/create-relation-usecase"
import { InvalidToken } from "../../../external/services/errors/invalid-token"
import { MatchNotFound } from "../../../usecases/errors/match-not-found"
import { UserNotFound } from "../../../usecases/errors/user-not-found"
import { GetMatchUseCase } from "../../../usecases/get-match-usecase"
import { InvalidId } from "../../../domain/user/errors/invalid-id"
import { Either, left, right } from "../../../shared/either"

export interface ReceiveMatchSocketRequest {
    headers: HttpRequestHeaders
    socketId: string
    matchId: string
}

export interface ReceiveMatchSocketResponse {
    board: {
        spots: ({ player: number, promoted: boolean } | void)[][],
        columns: number,
        rows: number
    }
    players: [ string, string? ]
    score: [ number, number ]
    spectator: boolean
    createdAt: string
    indexOf: number
    winner?: number
    turn: number
}

export class ReceiveMatchSocketHelper {

    private readonly getUserByHttpCookieUseCase: GetUserByHttpCookieUseCase
    private readonly createRelationUseCase: CreateRelationUseCase
    private readonly getMatchUseCase: GetMatchUseCase

    constructor(getUserByHttpCookieUseCase: GetUserByHttpCookieUseCase, createRelationUseCase: CreateRelationUseCase, getMatchUseCase: GetMatchUseCase) {
        this.getUserByHttpCookieUseCase = getUserByHttpCookieUseCase
        this.createRelationUseCase = createRelationUseCase
        this.getMatchUseCase = getMatchUseCase
    }

    async execute({ headers, socketId, matchId }: ReceiveMatchSocketRequest): Promise<Either<UserNotFound | InvalidToken | MatchNotFound | InvalidId, ReceiveMatchSocketResponse>> {
        
        const userOrError = await this.getUserByHttpCookieUseCase.execute({ headers })

        if (userOrError.isLeft())
            return left(userOrError.value)

        const matchOrError = await this.getMatchUseCase.execute({ matchId })

        if (matchOrError.isLeft())
            return left(matchOrError.value)

        const match = matchOrError.value
        const user  = userOrError.value
        const board = match.board

        const relationOrError = await this.createRelationUseCase.execute({
            matchId: match.id.value,
            userId: user.id.value,
            relationId: socketId
        })

        if (relationOrError.isLeft())
            return left(relationOrError.value)

        const indexOf = match.players.findIndex(player => player?.id.value == user.id.value)
        const spots = board.spots.map(array => array.map(piece => piece ? { player: piece.player, promoted: piece.promoted } : undefined))

        const response: ReceiveMatchSocketResponse = {
            board: {
                columns: board.columns,
                rows: board.rows,
                spots: spots
            },
            createdAt: match.createdAt.toUTCString(),
            score: match.score,
            players: [
                match.players[0]?.name.value,
                match.players[1]?.name.value
            ],
            spectator: indexOf < 0,
            winner: match.winner,
            indexOf: indexOf,
            turn: match.turn
        }

        return right(response)

    }

}