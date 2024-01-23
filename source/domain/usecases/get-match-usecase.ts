import { MatchRepository } from "../contracts/repositories/match-repository"
import { MatchNotFound } from "./errors/match-not-found"
import { Either, left, right } from "../../@shared/either"
import { Match } from "../entities/match/match"

export interface GetMatchRequest {
    matchId: string
}

export class GetMatchUseCase {

    private readonly matchRepository: MatchRepository

    constructor(matchRepository: MatchRepository) {
        this.matchRepository = matchRepository
    }

    async execute({ matchId }: GetMatchRequest): Promise<Either<MatchNotFound, Match>> {

        const matchOrUndefined = await this.matchRepository.findById(matchId)

        if (!matchOrUndefined)  
            return left(new MatchNotFound())
        
        return right(matchOrUndefined)

    }

}