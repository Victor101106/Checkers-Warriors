import { Either, left, right } from "../../shared/either"
import { InvalidId } from "../user/errors/invalid-id"
import { Id } from "../user/id"

export interface RelationRequest {
    relationId?: string
    matchId: string
    userId: string
}

export class Relation {
    
    public readonly relationId: Id
    public readonly matchId: Id
    public readonly userId: Id

    constructor(matchId: Id, userId: Id, relationId: Id) {
        this.relationId = relationId
        this.matchId = matchId
        this.userId = userId
        Object.freeze(this)
    }

    static create({ relationId, matchId, userId }: RelationRequest): Either<InvalidId, Relation> {

        const relationIdOrError = Id.create(relationId)
        const matchIdOrError = Id.create(matchId)
        const userIdOrError = Id.create(userId)

        if (relationIdOrError.isLeft())
            return left(relationIdOrError.value)

        if (matchIdOrError.isLeft())
            return left(matchIdOrError.value)

        if (userIdOrError.isLeft())
            return left(userIdOrError.value)

        return right(new Relation(
            relationIdOrError.value,
            matchIdOrError.value,
            userIdOrError.value
        ))

    }

}