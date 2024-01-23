import { MatchRepository } from "../contracts/repositories/match-repository"
import { UserRepository } from "../contracts/repositories/user-repository"
import { UniqueIdGateway } from "../contracts/gateways/unique-id-gateway"
import { VariationNotFound } from "./errors/variation-not-found"
import { InvalidId } from "../entities/user/errors/invalid-id"
import { Variation } from "../entities/match/types/variation"
import { CreateBoardUseCase } from "./create-board-usecase"
import { UserNotFound } from "./errors/user-not-found"
import { Either, left, right } from "../../@shared/either"
import { Match } from "../entities/match/match"

export interface CreateMatchRequest {
    variation: string
    userId: string
}

export class CreateMatchUseCase {

    private readonly createBoardUseCases: Array<CreateBoardUseCase>
    private readonly uniqueIdGateway: UniqueIdGateway
    private readonly matchRepository: MatchRepository
    private readonly userRepository: UserRepository

    constructor(createBoardUseCases: Array<CreateBoardUseCase>, uniqueIdGateway: UniqueIdGateway, matchRepository: MatchRepository, userRepository: UserRepository) {
        this.createBoardUseCases = createBoardUseCases
        this.uniqueIdGateway = uniqueIdGateway
        this.matchRepository = matchRepository
        this.userRepository = userRepository
    }

    async execute({ variation, userId }: CreateMatchRequest): Promise<Either<VariationNotFound | UserNotFound | InvalidId, Match>> {

        const variantNotFound = !Object.values(Variation).includes(<Variation>variation)

        if (variantNotFound)
            return left(new VariationNotFound())

        const userOrUndefined = await this.userRepository.findById(userId)

        if (!userOrUndefined)
            return left(new UserNotFound())
        
        const uniqueId = await this.uniqueIdGateway.generate() 
        const user = userOrUndefined
        
        const formatedVariation = variation.charAt(0).toUpperCase() + variation.slice(1).toLowerCase()    
        const formatedVariationToClassName = `Create${formatedVariation}BoardUseCase`

        const createBoardUseCase = this.createBoardUseCases.find(createBoardUseCase => createBoardUseCase.constructor.name == formatedVariationToClassName)

        if (!createBoardUseCase)
            return left(new VariationNotFound())

        const boardOrError = createBoardUseCase.execute()

        if (boardOrError.isLeft())
            return left(boardOrError.value)
        
        const board = boardOrError.value

        const matchOrError = Match.create({
            variation: <Variation>variation,
            players: [ user ],
            movements: [],
            board: board,
            id: uniqueId
        })

        if (matchOrError.isLeft())
            return left(matchOrError.value)
        
        await this.matchRepository.save(matchOrError.value)

        return right(matchOrError.value)

    }

}