import { RelationRepository } from "../../../external/repositories/relation-repository"
import { MatchAlreadyFull } from "../../../domain/usecases/errors/match-already-full"
import { MatchNotFound } from "../../../domain/usecases/errors/match-not-found"
import { UserNotFound } from "../../../domain/usecases/errors/user-not-found"
import { InvalidId } from "../../../domain/entities/user/errors/invalid-id"
import { GiveUpUseCase } from "../../../domain/usecases/give-up-usecase"
import { Either, left, right } from "../../../shared/either"
import { Id } from "../../../domain/entities/user/id"

export interface GiveUpSocketRequest {
    relationId: string
}

export interface GiveUpSocketResponse {
    winner: number
    matchId: Id
}

export class GiveUpSocketHelper {

    private readonly relationRepository: RelationRepository
    private readonly giveUpUseCase: GiveUpUseCase

    constructor(relationRepository: RelationRepository, giveUpUseCase: GiveUpUseCase) {
        this.relationRepository = relationRepository
        this.giveUpUseCase = giveUpUseCase
    }

    async execute({ relationId }: GiveUpSocketRequest): Promise<Either<InvalidId | UserNotFound | MatchNotFound | MatchAlreadyFull, GiveUpSocketResponse>> {

        const relationOrUndefined = await this.relationRepository.findById(relationId)

        if (!relationOrUndefined)
            return left(new InvalidId())

        const { matchId, userId } = relationOrUndefined

        const responseOrError = await this.giveUpUseCase.execute({ matchId: matchId.value, userId: userId.value })

        if (responseOrError.isLeft())
            return left(responseOrError.value)

        const response = responseOrError.value

        return right(Object.assign({ matchId }, response))

    }

}