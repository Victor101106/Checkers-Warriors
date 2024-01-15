import { MatchRepository } from "../../external/repositories/match-repository"
import { InvalidId } from "../entities/user/errors/invalid-id"
import { MatchNotFound } from "./errors/match-not-found"
import { Either, left, right } from "../../shared/either"

export interface GiveUpRequest {
    matchId: string
    userId: string
}

export interface GiveUpResponse {
    winner: number
}

export class GiveUpUseCase {

    private readonly matchRepository: MatchRepository

    constructor(matchRepository: MatchRepository) {
        this.matchRepository = matchRepository
    }

    async execute({ matchId, userId }: GiveUpRequest): Promise<Either<MatchNotFound | InvalidId, GiveUpResponse>> {

        const matchOrUndefined = await this.matchRepository.findById(matchId)

        if (!matchOrUndefined)
            return left(new MatchNotFound())
    
        const match = matchOrUndefined

        const playerIndex = match.players.findIndex(player => player?.id.value == userId)

        if (playerIndex == -1)
            return left(new InvalidId())

        const winner = playerIndex ? 0 : 1

        match.winner = winner

        return right({ winner })

    }

}