import { InMemoryRelationRepository } from "../external/repositories/in-memory/in-memory-relation-repository"
import { InMemoryMatchRepository } from "../external/repositories/in-memory/in-memory-match-repository"
import { InMemoryUserRepository } from "../external/repositories/in-memory/in-memory-user-repository"
import { bcryptPasswordService } from "../external/services/factory/password-service-factory"
import { uuidUniqueIdService } from "../external/services/factory/unique-id-service-factory"
import { createBrazilianBoardUseCase } from "./factory/create-board-usecase-factory"
import { CreateRelationUseCase } from "./create-relation-usecase"
import { CreateMatchUseCase } from "./create-match-usecase"
import { Variation } from "../domain/match/types/variation"
import { CreateUserUseCase } from "./create-user-usecase"
import { MatchNotFound } from "./errors/match-not-found"
import { Relation } from "../domain/relation/relation"
import { Left, Right } from "../shared/either"
import { describe, expect, it } from "vitest"
import { Match } from "../domain/match/match"
import { User } from "../domain/user/user"

describe('Create relation use case', async () => {

    const inMemoryRelationRepository = new InMemoryRelationRepository()
    const inMemoryMatchRepository = new InMemoryMatchRepository()
    const inMemoryUserRepository = new InMemoryUserRepository()

    const createMatchUseCase = new CreateMatchUseCase([ createBrazilianBoardUseCase ], uuidUniqueIdService, inMemoryMatchRepository, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordService, uuidUniqueIdService, inMemoryUserRepository)
    const createRelationUseCase = new CreateRelationUseCase(inMemoryRelationRepository, inMemoryMatchRepository)

    const userOrError = await createUserUseCase.execute({
        password: 'Password123.',
        email: 'email@mail.com',
        name: 'Name'
    })

    expect(userOrError).instanceOf(Right)

    const user = userOrError.value as User

    const brazilianMatchOrError = await createMatchUseCase.execute({
        variation: Variation.Brazilian,
        userId: user.id.value,
    })

    expect(brazilianMatchOrError).instanceOf(Right)

    const brazilianMatch = brazilianMatchOrError.value as Match

    it('should be able to create a relation', async () => {

        const relationOrError = await createRelationUseCase.execute({
            matchId: brazilianMatch.id.value,
            userId: user.id.value
        })

        expect(relationOrError).instanceOf(Right)
        expect(relationOrError.value).instanceOf(Relation)

    })

    it('should not be able to create a relation with a invalid match', async () => {

        const relationOrError = await createRelationUseCase.execute({
            matchId: 'XXXXXXXXXXXXXxx',
            userId: user.id.value
        })

        expect(relationOrError).instanceOf(Left)
        expect(relationOrError.value).instanceOf(MatchNotFound)

    })

})