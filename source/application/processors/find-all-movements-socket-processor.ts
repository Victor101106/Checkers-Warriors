import { FindAllMovementsOnMatchUseCase } from "../../domain/usecases/find-all-movements-on-match-usecase"
import { FindAllMovementsResponse } from "../../domain/usecases/find-all-movements-usecase"
import { RelationRepository } from "../../domain/contracts/repositories/relation-repository"
import { InvalidId } from "../../domain/entities/user/errors/invalid-id"
import { SocketProcessor } from "../contracts/socket-processor"
import { Either, left, right } from "../../shared/either"

export interface FindAllMovementsSocketProcessorRequest {
    relationId: string
}

export class FindAllMovementsSocketProcessor extends SocketProcessor {

    private readonly findAllMovementsOnMatchUseCase: FindAllMovementsOnMatchUseCase
    private readonly relationRepository: RelationRepository

    constructor(findAllMovementsOnMatchUseCase: FindAllMovementsOnMatchUseCase, relationRepository: RelationRepository) {
        super()
        this.findAllMovementsOnMatchUseCase = findAllMovementsOnMatchUseCase
        this.relationRepository = relationRepository
    }

    async perform({ relationId }: FindAllMovementsSocketProcessorRequest): Promise<Either<Error, FindAllMovementsResponse>> {
        
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