import { MovePieceOnMatchUseCase } from "../../domain/usecases/move-piece-on-match-usecase"
import { RelationRepository } from "../../domain/contracts/repositories/relation-repository"
import { InvalidId } from "../../domain/entities/user/errors/invalid-id"
import { Position } from "../../domain/entities/board/types/position"
import { InvalidParameters } from "../errors/invalid-parameters"
import { Jump } from "../../domain/entities/board/types/jump"
import { SocketProcessor } from "../contracts/socket-processor"
import { Either, left, right } from "../../shared/either"
import { Id } from "../../domain/entities/user/id"
import { z } from "zod"

export interface MovePieceSocketProcessorResponse {
    positions: Array<Position>
    startsAt: Position
    promoted: boolean
    endsAt: Position
    winner: boolean
    jumps: Array<Jump>
    matchId: Id
}

export class MovePieceSocketProcessor implements SocketProcessor {

    private readonly movePieceOnMatchUseCase: MovePieceOnMatchUseCase
    private readonly relationRepository: RelationRepository

    constructor(movePieceOnMatchUseCase: MovePieceOnMatchUseCase, relationRepository: RelationRepository) {
        this.movePieceOnMatchUseCase = movePieceOnMatchUseCase
        this.relationRepository = relationRepository
    }

    async execute(data: any): Promise<Either<Error, MovePieceSocketProcessorResponse>> {

        const positionSchema = z.object({ column: z.number(), row: z.number() })

        const dataSchema = z.object({
            relationId: z.string(),
            startsAt: positionSchema,
            endsAt: positionSchema
        })

        const dataSafeParse = dataSchema.safeParse(data)

        if (!dataSafeParse.success)
            return left(new InvalidParameters())

        const { relationId, startsAt, endsAt } = dataSafeParse.data

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