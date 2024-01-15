import { InMemoryMatchRepository } from "../../external/repositories/in-memory/in-memory-match-repository"
import { InMemoryUserRepository } from "../../external/repositories/in-memory/in-memory-user-repository"
import { bcryptPasswordGateway } from "../../external/gateways/factory/password-gateway-factory"
import { uuidUniqueIdGateway } from "../../external/gateways/factory/unique-id-gateway-factory"
import { createBrazilianBoardUseCase } from "./factory/create-board-usecase-factory"
import { GiveUpResponse, GiveUpUseCase } from "./give-up-usecase"
import { InvalidId } from "../entities/user/errors/invalid-id"
import { CreateMatchUseCase } from "./create-match-usecase"
import { Variation } from "../entities/match/types/variation"
import { CreateUserUseCase } from "./create-user-usecase"
import { MatchNotFound } from "./errors/match-not-found"
import { Match } from "../entities/match/match"
import { Left, Right } from "../../shared/either"
import { describe, expect, it } from "vitest"
import { User } from "../entities/user/user"

describe('Give up use case', async () => {

    const inMemoryMatchRepository = new InMemoryMatchRepository()
    const inMemoryUserRepository = new InMemoryUserRepository()

    const createMatchUseCase = new CreateMatchUseCase([ createBrazilianBoardUseCase ], uuidUniqueIdGateway, inMemoryMatchRepository, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordGateway, uuidUniqueIdGateway, inMemoryUserRepository)
    const giveUpUseCase = new GiveUpUseCase(inMemoryMatchRepository)

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

    it('should not be able to give up with a invalid id', async () => {

        const responseOrError = await giveUpUseCase.execute({
            matchId: brazilianMatch.id.value,
            userId: 'XXXX-XXXX-XXXX-XXXX',
        })

        expect(responseOrError).instanceOf(Left)
        expect(responseOrError.value).instanceOf(InvalidId)

    })

    it('should not be able to give up with a invalid match', async () => {

        const responseOrError = await giveUpUseCase.execute({
            matchId: 'XXXX-XXXX-XXXX-XXXX',
            userId: user.id.value,
        })

        expect(responseOrError).instanceOf(Left)
        expect(responseOrError.value).instanceOf(MatchNotFound)

    })

    it('should be able to give up on a match', async () => {

        const responseOrError = await giveUpUseCase.execute({
            matchId: brazilianMatch.id.value,
            userId: user.id.value,
        })

        expect(responseOrError).instanceOf(Right)
        expect((responseOrError.value as GiveUpResponse).winner).toBe(1)

    })

})