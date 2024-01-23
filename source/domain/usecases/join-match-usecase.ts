import { MatchRepository } from "../contracts/repositories/match-repository"
import { UserRepository } from "../contracts/repositories/user-repository"
import { MatchAlreadyFull } from "./errors/match-already-full"
import { MatchNotFound } from "./errors/match-not-found"
import { Either, left, right } from "../../@shared/either"
import { UserNotFound } from "./errors/user-not-found"
import { Match } from "../entities/match/match"

export interface JoinMatchRequest {
    matchId: string,
    userId: string
}

export class JoinMatchUseCase {

    private readonly matchRepository: MatchRepository
    private readonly userRepository: UserRepository

    constructor(matchRepository: MatchRepository, userRepository: UserRepository) {
        this.matchRepository = matchRepository
        this.userRepository = userRepository
    } 

    async execute({ matchId, userId }: JoinMatchRequest): Promise<Either<UserNotFound | MatchNotFound | MatchAlreadyFull, Match>> {

        const matchOrUndefined = await this.matchRepository.findById(matchId)
        const userOrUndefined = await this.userRepository.findById(userId)

        if (!matchOrUndefined)
            return left(new MatchNotFound())
        
        if (matchOrUndefined.players[1])
            return left(new MatchAlreadyFull())

        if (!userOrUndefined) 
            return left(new UserNotFound())
        
        matchOrUndefined.players[1] = userOrUndefined

        await this.matchRepository.update(matchOrUndefined)

        return right(matchOrUndefined)

    }

}