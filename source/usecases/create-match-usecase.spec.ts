import { InMemoryMatchRepository } from "../external/repositories/in-memory/in-memory-match-repository"
import { InMemoryUserRepository } from "../external/repositories/in-memory/in-memory-user-repository"
import { CreateBrazilianBoardUseCase } from "./adapters/create-board/create-brazilian-board-usecase"
import { BcryptPasswordService } from "../external/services/adapters/bcrypt-password-service"
import { UuidUniqueIdService } from "../external/services/adapters/uuid-unique-id-service"
import { Variation } from "../domain/match/types/variation"
import { CreateMatchUseCase } from "./create-match-usecase"
import { CreateUserUseCase } from "./create-user-usecase"
import { Left, Right } from "../shared/either"
import { describe, expect, it } from "vitest"
import { User } from "../domain/user/user"
import { VariationNotFound } from "./errors/variation-not-found"
import { UserNotFound } from "./errors/user-not-found"

describe('Create match use case', async () => {

    const createBrazilianBoardUseCase = new CreateBrazilianBoardUseCase()
    const inMemoryMatchRepository = new InMemoryMatchRepository()
    const inMemoryUserRepository = new InMemoryUserRepository()
    const uuidUniqueIdService = new UuidUniqueIdService()
    const bcryptPasswordService = new BcryptPasswordService()

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