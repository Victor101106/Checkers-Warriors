import { InMemoryMatchRepository } from "../../infra/repositories/in-memory-match-repository"
import { InMemoryUserRepository } from "../../infra/repositories/in-memory-user-repository"
import { bcryptPasswordGateway } from "../../main/factories/infra/gateways/password-gateway-factory"
import { uuidUniqueIdGateway } from "../../main/factories/infra/gateways/unique-id-gateway-factory"
import { createBrazilianBoardUseCase } from "../../main/factories/domain/usecases/create-board-usecase-factory"
import { CreateMatchUseCase } from "./create-match-usecase"
import { CreateUserUseCase } from "./create-user-usecase"
import { Left, Right } from "../../shared/either"
import { describe, expect, it } from "vitest"
import { Match } from "../entities/match/match"
import { User } from "../entities/user/user"
import { GetRandomUnfinishedMatchUseCase } from "./get-random-unfinished-match-usecase"

describe('Get random unfinished match use case', async () => {

    const inMemoryMatchRepository = new InMemoryMatchRepository()
    const inMemoryUserRepository = new InMemoryUserRepository()

    const createMatchUseCase = new CreateMatchUseCase([ createBrazilianBoardUseCase ], uuidUniqueIdGateway, inMemoryMatchRepository, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordGateway, uuidUniqueIdGateway, inMemoryUserRepository)
    const getRandomUnfinishedMatchUseCase = new GetRandomUnfinishedMatchUseCase(inMemoryMatchRepository)

    const userOrError = await createUserUseCase.execute({
        password: 'Password123.',
        email: 'email@mail.com',
        name: 'Name'
    })

    expect(userOrError).instanceOf(Right)

    const user = userOrError.value as User

    const matchOrError = await createMatchUseCase.execute({ variation: 'brazilian', userId: user.id.value })

    expect(matchOrError).instanceOf(Right)
    
    const match = matchOrError.value as Match

    it('should be able to get a random unfinished match', async () => {
      
        const matchOrUndefined = await getRandomUnfinishedMatchUseCase.execute()

        expect(matchOrUndefined).instanceOf(Right)
        expect((<Match>matchOrError.value).winner).toBeUndefined()

    })

    it('should not be able to get a random unfinished match', async () => {

        await inMemoryMatchRepository.delete(match.id.value)
      
        const matchOrUndefined = await getRandomUnfinishedMatchUseCase.execute()

        expect(matchOrUndefined).instanceOf(Left)

    })

})