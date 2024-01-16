import { MovePieceOnMatchUseCase } from "../../domain/usecases/move-piece-on-match-usecase"
import { RelationRepository } from "../../domain/contracts/repositories/relation-repository"
import { InvalidId } from "../../domain/entities/user/errors/invalid-id"
import { Position } from "../../domain/entities/board/types/position"
import { SocketProcessor } from "../contracts/socket-processor"
import { Jump } from "../../domain/entities/board/types/jump"
import { ValidationBuilder } from "../validation/builder"
import { Either, left, right } from "../../shared/either"
import { Validator } from "../validation/validator"
import { Id } from "../../domain/entities/user/id"

export interface MovePieceSocketProcessorResponse {
    positions: Array<Position>
    startsAt: Position
    promoted: boolean
    endsAt: Position
    winner: boolean
    jumps: Array<Jump>
    matchId: Id
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

        return right(Object.assign({ matchId }, responseOrError.value))

    }

}