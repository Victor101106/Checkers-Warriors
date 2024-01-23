import { MatchRepository } from "../contracts/repositories/match-repository"
import { Either, left, right } from "../../@shared/either"
import { Match } from "../entities/match/match"

export class GetRandomUnfinishedMatchUseCase {

    private readonly matchRepository: MatchRepository

    constructor(matchRepository: MatchRepository) {
        this.matchRepository = matchRepository
    }

    async execute(): Promise<Either<void, Match>> {

        const randomMatchOrUndefined = await this.matchRepository.getUnfinishedRandom()

        if (!randomMatchOrUndefined)
            return left(undefined)

        return right(randomMatchOrUndefined)

    }

}