import { MovePieceOnMatchUseCase } from "../../../usecases/move-piece-on-match-usecase"
import { RelationRepository } from "../../../external/repositories/relation-repository"
import { VariationNotFound } from "../../../usecases/errors/variation-not-found"
import { MatchNotFound } from "../../../usecases/errors/match-not-found"
import { InvalidId } from "../../../domain/user/errors/invalid-id"
import { Position } from "../../../domain/board/types/position"
import { Either, left, right } from "../../../shared/either"
import { Jump } from "../../../domain/board/types/jump"
import { Id } from "../../../domain/user/id"

export interface MovePieceSocketRequest {
    relationId: string
    startsAt: Position
    endsAt: Position
}

export interface MovePieceSocketResponse {
    positions: Array<Position>
    startsAt: Position
    promoted: boolean
    endsAt: Position
    winner: boolean
    jumps: Array<Jump>
    matchId: Id
}

export class MovePieceSocketHelper {

    private readonly movePieceOnMatchUseCase: MovePieceOnMatchUseCase
    private readonly relationRepository: RelationRepository

    constructor(movePieceOnMatchUseCase: MovePieceOnMatchUseCase, relationRepository: RelationRepository) {
        this.movePieceOnMatchUseCase = movePieceOnMatchUseCase
        this.relationRepository = relationRepository
    }

    async execute({ relationId, startsAt, endsAt }: MovePieceSocketRequest): Promise<Either<InvalidId | MatchNotFound | VariationNotFound, MovePieceSocketResponse>> {

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