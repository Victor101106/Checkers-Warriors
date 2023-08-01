import { InMemoryMatchRepository } from "../../external/repositories/in-memory/in-memory-match-repository"
import { InMemoryUserRepository } from "../../external/repositories/in-memory/in-memory-user-repository"
import { jwtAccessTokenService } from "../../external/services/factory/access-token-service-factory"
import { createBrazilianBoardUseCase } from "../../usecases/factory/create-board-usecase-factory"
import { bcryptPasswordService } from "../../external/services/factory/password-service-factory"
import { uuidUniqueIdService } from "../../external/services/factory/unique-id-service-factory"
import { GetUserByHttpCookieUseCase } from "../../usecases/get-user-by-http-cookie-usecase"
import { AuthenticateUserUseCase } from "../../usecases/authenticate-user-usecase"
import { CreateMatchUseCase } from "../../usecases/create-match-usecase"
import { CreateUserUseCase } from "../../usecases/create-user-usecase"
import { CreateMatchController } from "./create-match-controller"
import { describe, expect, it } from "vitest"
import { Right } from "../../shared/either"
import dotenv from 'dotenv'

describe('Create match controller', async () => {

    dotenv.config()

    const inMemoryMatchRepository = new InMemoryMatchRepository()
    const inMemoryUserRepository = new InMemoryUserRepository()

    const createMatchUseCase = new CreateMatchUseCase([ createBrazilianBoardUseCase ], uuidUniqueIdService, inMemoryMatchRepository, inMemoryUserRepository)
    const authenticateUserUseCase = new AuthenticateUserUseCase(jwtAccessTokenService, bcryptPasswordService, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordService, uuidUniqueIdService, inMemoryUserRepository)
    const getUserByHttpCookieUseCase = new GetUserByHttpCookieUseCase(jwtAccessTokenService, inMemoryUserRepository)
    const createMatchController = new CreateMatchController(getUserByHttpCookieUseCase, createMatchUseCase)

    const createdUserOrError = await createUserUseCase.execute({
        password: 'Password123.',
        email: 'email@mail.com',
        name: 'Name'
    })

    expect(createdUserOrError).instanceOf(Right)

    const accessTokenOrError = await authenticateUserUseCase.execute({
        password: 'Password123.',
        email: 'email@mail.com'
    })

    expect(accessTokenOrError).instanceOf(Right)

    const accessToken = accessTokenOrError.value

    it('should be able to receive a status code 201 to create a match', async () => {

        const response = await createMatchController.handle({
            headers: { cookie: `access-token=${accessToken}` },
            body: { variation: 'brazilian' },
            query: {}
        })

        expect(response.code).toBe(201)
        expect(response.body.id).toBeTruthy()

    })

    it('should be able to receive a status code 400 to create a match with invalid parameters', async () => {

        const response = await createMatchController.handle({
            headers: { cookie: `access-token=${accessToken}` },
            query: {},
            body: {}
        })

        expect(response.code).toBe(400)
        expect(response.body.name).toBe('InvalidParameters')

    })

    it('should be able to receive a status code 401 to create a match withou access token', async () => {

        const response = await createMatchController.handle({
            body: { variation: 'brazilian' },
            headers: {},
            query: {}
        })

        expect(response.code).toBe(401)
        expect(response.body.name).toBe('InvalidToken')

    })

})