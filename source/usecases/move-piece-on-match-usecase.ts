import { MatchRepository } from "../external/repositories/match-repository"
import { MovePieceResponse, MovePieceUseCase } from "./move-piece-usecase"
import { VariationNotFound } from "./errors/variation-not-found"
import { Position } from "../domain/board/types/position"
import { MatchNotFound } from "./errors/match-not-found"
import { Either, left, right } from "../shared/either"
import { InvalidTurn } from "./errors/invalid-turn"

export interface MovePieceOnMatch {
    startsAt: Position
    endsAt: Position
    matchId: string
    userId: string
}

export class MovePieceOnMatchUseCase {

    private readonly movePieceUseCases: Array<MovePieceUseCase>
    private readonly matchRepository: MatchRepository

    constructor(movePieceUseCases: Array<MovePieceUseCase>, matchRepository: MatchRepository) {
        this.movePieceUseCases = movePieceUseCases
        this.matchRepository = matchRepository
    }

    async execute({ startsAt, endsAt, matchId, userId }: MovePieceOnMatch): Promise<Either<MatchNotFound | VariationNotFound, MovePieceResponse>> {

        const matchOrUndefined = await this.matchRepository.findById(matchId)

        if (!matchOrUndefined)
            return left(new MatchNotFound())
        
        const match = matchOrUndefined

        if (match.players[match.turn]?.id.value != userId)
            return left(new InvalidTurn())
        
        const formatedVariation = match.variation.charAt(0).toUpperCase() + match.variation.slice(1).toLowerCase()    
        const formatedVariationToClassName = `Move${formatedVariation}PieceUseCase`

        const movePieceUseCase = this.movePieceUseCases.find(movePieceUseCase => movePieceUseCase.constructor.name == formatedVariationToClassName)

        if (!movePieceUseCase)
            return left(new VariationNotFound())
        
        const responseOrError = movePieceUseCase.execute({
            board: match.board,
            startsAt: startsAt,
            endsAt: endsAt
        })

        if (responseOrError.isLeft())
            return left(responseOrError.value)

        match.score[match.turn] += responseOrError.value.jumps.length
        match.reverseTurn()

        await this.matchRepository.save(match)

        return right(responseOrError.value)

    }

}