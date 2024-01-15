import { FindAllMovementsOnMatchUseCase } from "../../../domain/usecases/find-all-movements-on-match-usecase"
import { FindAllMovementsResponse } from "../../../domain/usecases/find-all-movements-usecase"
import { RelationRepository } from "../../../external/repositories/relation-repository"
import { VariationNotFound } from "../../../domain/usecases/errors/variation-not-found"
import { InvalidMovement } from "../../../domain/usecases/errors/invalid-movement"
import { MatchNotFound } from "../../../domain/usecases/errors/match-not-found"
import { UserNotFound } from "../../../domain/usecases/errors/user-not-found"
import { InvalidId } from "../../../domain/entities/user/errors/invalid-id"
import { Either, left, right } from "../../../shared/either"

export interface FindAllMovementsSocketRequest {
    relationId: string   
}

export class FindAllMovementsSocketHelper {

    private readonly findAllMovementsOnMatchUseCase: FindAllMovementsOnMatchUseCase
    private readonly relationRepository: RelationRepository

    constructor(findAllMovementsOnMatchUseCase: FindAllMovementsOnMatchUseCase, relationRepository: RelationRepository) {
        this.findAllMovementsOnMatchUseCase = findAllMovementsOnMatchUseCase
        this.relationRepository = relationRepository
    }

    async execute({ relationId }: FindAllMovementsSocketRequest): Promise<Either<InvalidId | MatchNotFound | InvalidMovement | VariationNotFound | UserNotFound, FindAllMovementsResponse>> {
        
        const relationOrUndefined = await this.relationRepository.findById(relationId)

        if (!relationOrUndefined)
            return left(new InvalidId())

        const { matchId, userId } = relationOrUndefined

        const responseOrError = await this.findAllMovementsOnMatchUseCase.execute({ matchId: matchId.value, userId: userId.value })
        
        if (responseOrError.isLeft())
            return left(responseOrError.value)

        return right(responseOrError.value)
        
    }

}