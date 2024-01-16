import { GetUserByAccessTokenUseCase } from "../../domain/usecases/get-user-by-access-token-usecase"
import { CreateRelationUseCase } from "../../domain/usecases/create-relation-usecase"
import { GetMatchUseCase } from "../../domain/usecases/get-match-usecase"
import { Movement } from "../../domain/entities/match/types/movement"
import { SocketProcessor } from "../contracts/socket-processor"
import { Either, left, right } from "../../shared/either"
import { ValidationBuilder } from "../validation/builder"
import { Validator } from "../validation/validator"

export interface ReceiveMatchSocketProcessorResponse {
    board: {
        spots: ({ player: number, promoted: boolean } | void)[][],
        columns: number,
        rows: number
    },
    players: [ string, string? ]
    score: [ number, number ]
    movements: Movement[]
    spectator: boolean
    createdAt: string
    indexOf: number
    winner?: number
    turn: number
}

export class ReceiveMatchSocketProcessor extends SocketProcessor {

    private readonly getUserByAccessTokenUseCase: GetUserByAccessTokenUseCase
    private readonly createRelationUseCase: CreateRelationUseCase
    private readonly getMatchUseCase: GetMatchUseCase

    constructor(getUserByAccessTokenUseCase: GetUserByAccessTokenUseCase, createRelationUseCase: CreateRelationUseCase, getMatchUseCase: GetMatchUseCase) {
        super()
        this.getUserByAccessTokenUseCase = getUserByAccessTokenUseCase
        this.createRelationUseCase = createRelationUseCase
        this.getMatchUseCase = getMatchUseCase
    }

    protected buildValidators(data: any): Validator[] {
        return [
            ...ValidationBuilder.of('accessToken', data.accessToken).required().string().build(),
            ...ValidationBuilder.of('socketId', data.socketId).required().string().build(),
            ...ValidationBuilder.of('matchId', data.matchId).required().string().build()
        ]
    }

    async perform(data: any): Promise<Either<Error, ReceiveMatchSocketProcessorResponse>> {
        
        const { accessToken, socketId, matchId } = data

        const userOrError = await this.getUserByAccessTokenUseCase.execute({ accessToken })

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

        const response: ReceiveMatchSocketProcessorResponse = {
            board: {
                columns: board.columns,
                rows: board.rows,
                spots: spots
            },
            movements: match.movements,
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