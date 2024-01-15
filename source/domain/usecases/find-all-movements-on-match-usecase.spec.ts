import { InMemoryMatchRepository } from "../../infra/repositories/in-memory-match-repository"
import { InMemoryUserRepository } from "../../infra/repositories/in-memory-user-repository"
import { findAllBrazilianMovementsUseCase } from "../../main/factories/domain/usecases/find-all-movements-usecase-factory"
import { bcryptPasswordGateway } from "../../main/factories/infra/gateways/password-gateway-factory"
import { uuidUniqueIdGateway } from "../../main/factories/infra/gateways/unique-id-gateway-factory"
import { FindAllMovementsOnMatchUseCase } from "./find-all-movements-on-match-usecase"
import { createBrazilianBoardUseCase } from "../../main/factories/domain/usecases/create-board-usecase-factory"
import { FindAllMovementsResponse } from "./find-all-movements-usecase"
import { CreateMatchUseCase } from "./create-match-usecase"
import { Variation } from "../entities/match/types/variation"
import { CreateUserUseCase } from "./create-user-usecase"
import { describe, expect, it } from "vitest"
import { Match } from "../entities/match/match"
import { User } from "../entities/user/user"
import { Right } from "../../shared/either"

describe('Find all movements on match use case', async () => {
    
    const inMemoryMatchRepository = new InMemoryMatchRepository()
    const inMemoryUserRepository = new InMemoryUserRepository()

    const createMatchUseCase = new CreateMatchUseCase([ createBrazilianBoardUseCase ], uuidUniqueIdGateway, inMemoryMatchRepository, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordGateway, uuidUniqueIdGateway, inMemoryUserRepository)
    
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