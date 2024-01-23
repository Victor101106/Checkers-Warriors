import { RelationRepository } from "../../domain/contracts/repositories/relation-repository"
import { InvalidId } from "../../domain/entities/user/errors/invalid-id"
import { GiveUpUseCase } from "../../domain/usecases/give-up-usecase"
import { SocketProcessor } from "../contracts/socket-processor"
import { Either, left, right } from "../../@shared/either"
import { Id } from "../../domain/entities/user/id"

export interface GiveUpSocketProcessorRequest {
    relationId: string
}

export interface GiveUpSocketProcessorResponse {
    winner: number
    matchId: Id
}

export class GiveUpSocketProcessor extends SocketProcessor {

    private readonly relationRepository: RelationRepository
    private readonly giveUpUseCase: GiveUpUseCase

    constructor(relationRepository: RelationRepository, giveUpUseCase: GiveUpUseCase) {
        super()
        this.relationRepository = relationRepository
        this.giveUpUseCase = giveUpUseCase
    }

    async perform({ relationId }: GiveUpSocketProcessorRequest): Promise<Either<Error, GiveUpSocketProcessorResponse>> {

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