import { FindAllMovementsResponse, FindAllMovementsUseCase } from "./find-all-movements-usecase"
import { MatchRepository } from "../contracts/repositories/match-repository"
import { VariationNotFound } from "./errors/variation-not-found"
import { InvalidMovement } from "./errors/invalid-movement"
import { MatchNotFound } from "./errors/match-not-found"
import { Either, left, right } from "../../shared/either"
import { UserNotFound } from "./errors/user-not-found"

export interface FindAllMovementsOnMatchRequest {
    matchId: string
    userId: string
}

export class FindAllMovementsOnMatchUseCase {

    private readonly findAllMovementsUseCases: Array<FindAllMovementsUseCase>
    private readonly matchRepository: MatchRepository

    constructor(findAllMovementsUseCases: Array<FindAllMovementsUseCase>, matchRepository: MatchRepository) {
        this.findAllMovementsUseCases = findAllMovementsUseCases
        this.matchRepository = matchRepository
    }

    async execute({ matchId, userId }: FindAllMovementsOnMatchRequest): Promise<Either<MatchNotFound | InvalidMovement | VariationNotFound | UserNotFound, FindAllMovementsResponse>> {

        const matchOrUndefined = await this.matchRepository.findById(matchId)

        if (!matchOrUndefined)
            return left(new MatchNotFound())
        
        const match = matchOrUndefined
        const board = match.board

        const player = match.players.findIndex(player => player?.id.value == userId)

        if (!(player == 0 || player == 1))
            return left(new UserNotFound())

        const formatedVariation = match.variation.charAt(0).toUpperCase() + match.variation.slice(1).toLowerCase()    
        const formatedVariationToClassName = `FindAll${formatedVariation}MovementsUseCase`

        const findAllMovementsUseCase = this.findAllMovementsUseCases.find(findAllMovementsUseCase => findAllMovementsUseCase.constructor.name == formatedVariationToClassName)

        if (!findAllMovementsUseCase)
            return left(new VariationNotFound())
        
        const allMovementsOrError = findAllMovementsUseCase.execute({ player, board })

        if (allMovementsOrError.isLeft())
            return left(allMovementsOrError.value)
        
        const allMovements = allMovementsOrError.value

        return right(allMovements)

    }

}