import { MovePieceOnMatchUseCase } from "../../domain/usecases/move-piece-on-match-usecase"
import { RelationRepository } from "../../domain/contracts/repositories/relation-repository"
import { MovementPresenter } from "../presenters/api/movement-presenter"
import { InvalidId } from "../../domain/entities/user/errors/invalid-id"
import { SocketProcessor } from "../contracts/socket-processor"
import { Either, left, right } from "../../shared/either"
import { ValidationBuilder } from "../validation/builder"
import { Validator } from "../validation/validator"

export interface MovePieceSocketProcessorResponse extends ReturnType<typeof MovementPresenter.toJSON> {
    matchId: string
}

export class MovePieceSocketProcessor extends SocketProcessor {

    private readonly movePieceOnMatchUseCase: MovePieceOnMatchUseCase
    private readonly relationRepository: RelationRepository

    constructor(movePieceOnMatchUseCase: MovePieceOnMatchUseCase, relationRepository: RelationRepository) {
        super()
        this.movePieceOnMatchUseCase = movePieceOnMatchUseCase
        this.relationRepository = relationRepository
    }

    protected buildValidators(data: any): Validator[] {
        return [
            ...ValidationBuilder.of('relationId', data.relationId).required().string().build(),
            ...ValidationBuilder.of('startsAt', data.startsAt).required().position().build(),
            ...ValidationBuilder.of('endsAt', data.endsAt).required().position().build()
        ]
    }

    async perform(data: any): Promise<Either<Error, MovePieceSocketProcessorResponse>> {

        const { relationId, startsAt, endsAt } = data

        const relationOrUndefined = await this.relationRepository.findById(relationId)

        if (!relationOrUndefined)
            return left(new InvalidId())

        const { matchId, userId } = relationOrUndefined

        const responseOrError = await this.movePieceOnMatchUseCase.execute({
            matchId: matchId.value,
            userId: userId.value,
            startsAt: startsAt,
            endsAt: endsAt
        })

        if (responseOrError.isLeft())
            return left(responseOrError.value)

        return right(Object.assign({ matchId: matchId.value }, MovementPresenter.toJSON(responseOrError.value)))

    }

}