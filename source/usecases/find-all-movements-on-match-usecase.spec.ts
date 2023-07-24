import { InMemoryMatchRepository } from "../external/repositories/in-memory/in-memory-match-repository"
import { InMemoryUserRepository } from "../external/repositories/in-memory/in-memory-user-repository"
import { findAllBrazilianMovementsUseCase } from "./factory/find-all-movements-usecase-factory"
import { bcryptPasswordService } from "../external/services/factory/password-service-factory"
import { uuidUniqueIdService } from "../external/services/factory/unique-id-service-factory"
import { FindAllMovementsOnMatchUseCase } from "./find-all-movements-on-match-usecase"
import { createBrazilianBoardUseCase } from "./factory/create-board-usecase-factory"
import { FindAllMovementsResponse } from "./find-all-movements-usecase"
import { CreateMatchUseCase } from "./create-match-usecase"
import { Variation } from "../domain/match/types/variation"
import { CreateUserUseCase } from "./create-user-usecase"
import { describe, expect, it } from "vitest"
import { Match } from "../domain/match/match"
import { User } from "../domain/user/user"
import { Right } from "../shared/either"

describe('Find all movements on match use case', async () => {
    
    const inMemoryMatchRepository = new InMemoryMatchRepository()
    const inMemoryUserRepository = new InMemoryUserRepository()

    const createMatchUseCase = new CreateMatchUseCase([ createBrazilianBoardUseCase ], uuidUniqueIdService, inMemoryMatchRepository, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordService, uuidUniqueIdService, inMemoryUserRepository)
    
    const findAllMovementsOnMatchUseCase = new FindAllMovementsOnMatchUseCase([
        findAllBrazilianMovementsUseCase
    ], inMemoryMatchRepository)

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

    it('should be able to find all movements on a brazilian match', async () => {

        const allBrazilianMovementsOrError = await findAllMovementsOnMatchUseCase.execute({
            matchId: brazilianMatch.id.value,
            userId: user.id.value
        })

        expect(allBrazilianMovementsOrError).instanceOf(Right)

        const allBrazilianMovements = allBrazilianMovementsOrError.value as FindAllMovementsResponse

        expect(allBrazilianMovements.length).toBe(7)

    })

})