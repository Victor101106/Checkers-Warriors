import { InMemoryMatchRepository } from "../external/repositories/in-memory/in-memory-match-repository"
import { InMemoryUserRepository } from "../external/repositories/in-memory/in-memory-user-repository"
import { bcryptPasswordService } from "../external/services/factory/password-service-factory"
import { uuidUniqueIdService } from "../external/services/factory/unique-id-service-factory"
import { createBrazilianBoardUseCase } from "./factory/create-board-usecase-factory"
import { VariationNotFound } from "./errors/variation-not-found"
import { CreateMatchUseCase } from "./create-match-usecase"
import { Variation } from "../domain/match/types/variation"
import { CreateUserUseCase } from "./create-user-usecase"
import { UserNotFound } from "./errors/user-not-found"
import { Left, Right } from "../shared/either"
import { describe, expect, it } from "vitest"
import { User } from "../domain/user/user"

describe('Create match use case', async () => {

    const inMemoryMatchRepository = new InMemoryMatchRepository()
    const inMemoryUserRepository = new InMemoryUserRepository()

    const createMatchUseCase = new CreateMatchUseCase([ createBrazilianBoardUseCase ], uuidUniqueIdService, inMemoryMatchRepository, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordService, uuidUniqueIdService, inMemoryUserRepository)

    const userOrError = await createUserUseCase.execute({
        password: 'Password123.',
        email: 'email@mail.com',
        name: 'Name'
    })

    expect(userOrError).instanceOf(Right)

    const user = userOrError.value as User
    const userId = user.id.value

    it('should be able to create a brazilian match', async () => {
        
        const brazilianMatchOrError = await createMatchUseCase.execute({
            variation: Variation.Brazilian,
            userId: userId,
        })

        expect(brazilianMatchOrError).instanceOf(Right)

    })

    it('should be able to create a brazilian match with a user not found', async () => {
        
        const brazilianMatchOrError = await createMatchUseCase.execute({
            variation: Variation.Brazilian,
            userId: 'bc59dc72-283c-42a3-b050-f0384d95a5cc',
        })

        expect(brazilianMatchOrError).instanceOf(Left)
        expect(brazilianMatchOrError.value).instanceOf(UserNotFound)

    })

    it('should not be able to create a international match', async () => {
        
        const internationalMatchOrError = await createMatchUseCase.execute({
            variation: Variation.International,
            userId: userId,
        })

        expect(internationalMatchOrError).instanceOf(Left)
        expect(internationalMatchOrError.value).instanceOf(VariationNotFound)

    })

})