import { RelationRepository } from "../../../external/repositories/relation-repository"
import { MatchAlreadyFull } from "../../../usecases/errors/match-already-full"
import { MatchNotFound } from "../../../usecases/errors/match-not-found"
import { JoinMatchUseCase } from "../../../usecases/join-match-usecase"
import { UserNotFound } from "../../../usecases/errors/user-not-found"
import { InvalidId } from "../../../domain/user/errors/invalid-id"
import { Either, left, right } from "../../../shared/either"
import { Match } from "../../../domain/match/match"

export interface JoinMatchSocketRequest {
    relationId: string
}

export interface JoinMatchSocketResponse {
    indexOf: number
    player: string
    match: Match
}

export class JoinMatchSocketHelper {

    private readonly relationRepository: RelationRepository
    private readonly joinMatchUseCase: JoinMatchUseCase

    constructor(relationRepository: RelationRepository, joinMatchUseCase: JoinMatchUseCase) {
        this.relationRepository = relationRepository
        this.joinMatchUseCase = joinMatchUseCase
    }

    async execute({ relationId }: JoinMatchSocketRequest): Promise<Either<InvalidId | UserNotFound | MatchNotFound | MatchAlreadyFull, JoinMatchSocketResponse>> {

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