import { RelationRepository } from "../contracts/repositories/relation-repository"
import { MatchRepository } from "../contracts/repositories/match-repository"
import { InvalidId } from "../entities/user/errors/invalid-id"
import { MatchNotFound } from "./errors/match-not-found"
import { Either, left, right } from "../../@shared/either"
import { Relation } from "../entities/relation/relation"

export interface CreateRelationRequest {
    relationId?: string,
    matchId: string,
    userId: string
}

export class CreateRelationUseCase {

    private readonly relationRepository: RelationRepository
    private readonly matchRepository: MatchRepository

    constructor(relationRepository: RelationRepository, matchRepository: MatchRepository) {
        this.relationRepository = relationRepository
        this.matchRepository = matchRepository
    }

    async execute({ relationId, matchId, userId }: CreateRelationRequest): Promise<Either<MatchNotFound | InvalidId, Relation>> {
        
        const matchOrUndefined = await this.matchRepository.findById(matchId)

        if (!matchOrUndefined)
            return left(new MatchNotFound())
    
        const relationOrError = Relation.create({ relationId, userId, matchId })

        if (relationOrError.isLeft())
            return left(relationOrError.value)

        const relation = relationOrError.value

        await this.relationRepository.save(relation)

        return right(relation)

    }
    
}