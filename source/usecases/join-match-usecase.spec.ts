import { InMemoryMatchRepository } from "../external/repositories/in-memory/in-memory-match-repository"
import { InMemoryUserRepository } from "../external/repositories/in-memory/in-memory-user-repository"
import { CreateBrazilianBoardUseCase } from "./adapters/create-board/create-brazilian-board-usecase"
import { BcryptPasswordService } from "../external/services/adapters/bcrypt-password-service"
import { UuidUniqueIdService } from "../external/services/adapters/uuid-unique-id-service"
import { MatchAlreadyFull } from "./errors/match-already-full"
import { Variation } from "../domain/match/types/variation"
import { CreateMatchUseCase } from "./create-match-usecase"
import { CreateUserUseCase } from "./create-user-usecase"
import { MatchNotFound } from "./errors/match-not-found"
import { JoinMatchUseCase } from "./join-match-usecase"
import { Left, Right } from "../shared/either"
import { describe, expect, it } from "vitest"
import { Match } from "../domain/match/match"
import { User } from "../domain/user/user"

describe('Join match use case', async () => {

    const createBrazilianBoardUseCase = new CreateBrazilianBoardUseCase()
    const inMemoryMatchRepository = new InMemoryMatchRepository()
    const inMemoryUserRepository = new InMemoryUserRepository()
    const uuidUniqueIdService = new UuidUniqueIdService()
    const bcryptPasswordService = new BcryptPasswordService()

    const createMatchUseCase = new CreateMatchUseCase([ createBrazilianBoardUseCase ], uuidUniqueIdService, inMemoryMatchRepository, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordService, uuidUniqueIdService, inMemoryUserRepository)
    const joinMatchUseCase = new JoinMatchUseCase(inMemoryMatchRepository, inMemoryUserRepository)

    const userOrError = await createUserUseCase.execute({
        password: 'Password123.',
        email: 'email1@mail.com',
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

    it('should be able to join in a match', async () => {
        
        const matchOrError = await joinMatchUseCase.execute({
            matchId: brazilianMatch.id.value,
            userId: user.id.value
        })

        expect(matchOrError).instanceOf(Right)

    })

    it('should not be able to join in a match already full', async () => {
        
        const matchOrError = await joinMatchUseCase.execute({
            matchId: brazilianMatch.id.value,
            userId: user.id.value
        })

        expect(matchOrError).instanceOf(Left)
        expect(matchOrError.value).instanceOf(MatchAlreadyFull)

    })

    it('should not be able to join in a match than not exists', async () => {
        
        const matchOrError = await joinMatchUseCase.execute({
            matchId: '294f648d-cd9d-4bc3-a80b-3594c82aaf39',
            userId: user.id.value
        })

        expect(matchOrError).instanceOf(Left)
        expect(matchOrError.value).instanceOf(MatchNotFound)

    })

})