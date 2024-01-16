import { RelationRepository } from "../../domain/contracts/repositories/relation-repository"
import { JoinMatchUseCase } from "../../domain/usecases/join-match-usecase"
import { InvalidId } from "../../domain/entities/user/errors/invalid-id"
import { SocketProcessor } from "../contracts/socket-processor"
import { Either, left, right } from "../../shared/either"
import { Match } from "../../domain/entities/match/match"

export interface JoinMatchSocketProcessorRequest {
    relationId: string
}

export interface JoinMatchSocketProcessorResponse {
    indexOf: number
    player: string
    match: Match
}

export class JoinMatchSocketProcessor extends SocketProcessor {

    private readonly relationRepository: RelationRepository
    private readonly joinMatchUseCase: JoinMatchUseCase

    constructor(relationRepository: RelationRepository, joinMatchUseCase: JoinMatchUseCase) {
        super()
        this.relationRepository = relationRepository
        this.joinMatchUseCase = joinMatchUseCase
    }

    async perform({ relationId }: JoinMatchSocketProcessorRequest): Promise<Either<Error, JoinMatchSocketProcessorResponse>> {

        const relationOrUndefined = await this.relationRepository.findById(relationId)

        if (!relationOrUndefined)
            return left(new InvalidId())

        const { matchId, userId } = relationOrUndefined

        const matchOrError = await this.joinMatchUseCase.execute({ matchId: matchId.value, userId: userId.value })

        if (matchOrError.isLeft())
            return left(matchOrError.value)

        const match = matchOrError.value

        const indexOf = match.players.findIndex(player => player?.id.value == userId.value)
        const player  = match.players[indexOf]?.name.value || ''

        return right({ match, indexOf, player })

    }

}