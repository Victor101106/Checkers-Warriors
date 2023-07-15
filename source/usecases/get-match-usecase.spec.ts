import { InMemoryMatchRepository } from "../external/repositories/in-memory/in-memory-match-repository"
import { InMemoryUserRepository } from "../external/repositories/in-memory/in-memory-user-repository"
import { CreateBrazilianBoardUseCase } from "./adapters/create-board/create-brazilian-board-usecase"
import { BcryptPasswordService } from "../external/services/adapters/bcrypt-password-service"
import { UuidUniqueIdService } from "../external/services/adapters/uuid-unique-id-service"
import { CreateMatchUseCase } from "./create-match-usecase"
import { CreateUserUseCase } from "./create-user-usecase"
import { MatchNotFound } from "./errors/match-not-found"
import { GetMatchUseCase } from "./get-match-usecase"
import { Left, Right } from "../shared/either"
import { describe, expect, it } from "vitest"
import { Match } from "../domain/match/match"
import { User } from "../domain/user/user"

describe('Create match use case', async () => {

    const createBrazilianBoardUseCase = new CreateBrazilianBoardUseCase()
    const inMemoryMatchRepository = new InMemoryMatchRepository()
    const inMemoryUserRepository = new InMemoryUserRepository()
    const uuidUniqueIdService = new UuidUniqueIdService()
    const bcryptPasswordService = new BcryptPasswordService()

    const createMatchUseCase = new CreateMatchUseCase([ createBrazilianBoardUseCase ], uuidUniqueIdService, inMemoryMatchRepository, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordService, uuidUniqueIdService, inMemoryUserRepository)
    const getMatchUseCase = new GetMatchUseCase(inMemoryMatchRepository)

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

    it('should be able to get a match', async () => {
      
        const matchOrError = await getMatchUseCase.execute({ matchId: match.id.value })

        expect(matchOrError).instanceOf(Right)
        expect((<Match>matchOrError.value).id.value).toBe(match.id.value)

    })

    it('should not be able to get a match than not exists', async () => {
      
        const matchOrError = await getMatchUseCase.execute({ matchId: '294f648d-cd9d-4bc3-a80b-3594c82aaf39' })

        expect(matchOrError).instanceOf(Left)
        expect(matchOrError.value).instanceOf(MatchNotFound)

    })

})