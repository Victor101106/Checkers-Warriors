import { InMemoryUserRepository } from "../../external/repositories/in-memory/in-memory-user-repository"
import { jwtAccessTokenService } from "../../external/services/factory/access-token-service-factory"
import { bcryptPasswordService } from "../../external/services/factory/password-service-factory"
import { uuidUniqueIdService } from "../../external/services/factory/unique-id-service-factory"
import { AuthenticateUserUseCase } from "../../usecases/authenticate-user-usecase"
import { AuthenticateUserController } from "./authenticate-user-controller"
import { CreateUserUseCase } from "../../usecases/create-user-usecase"
import { CreateUserController } from "./create-user-controller"
import { describe, expect, it } from "vitest"
import dotenv from 'dotenv'

describe('Authenticate user controller', async () => {

    dotenv.config()

    const inMemoryUserRepository = new InMemoryUserRepository()
    const authenticateUserUseCase = new AuthenticateUserUseCase(jwtAccessTokenService, bcryptPasswordService, inMemoryUserRepository)
    const authenticateUserController = new AuthenticateUserController(authenticateUserUseCase)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordService, uuidUniqueIdService, inMemoryUserRepository)
    const createUserController = new CreateUserController(createUserUseCase)

    const createUserRequestBody = {
        password: 'Password123.',
        email: 'email@mail.com',
        name: 'Name'
    }

    const createUserResponse = await createUserController.handle({
        body: createUserRequestBody,
        headers: {},
        query: {}
    })

    expect(createUserResponse.code).toBe(201)

    it('should be able to receive a cookie and status code 200 when authenticate a valid user', async () => {

        const response = await authenticateUserController.handle({
            body: {
                email: 'email@mail.com',
                password: 'Password123.'
            },
            headers: {},
            query: {}
        })

        expect(response.code).toBe(200)
        expect(response.body.auth).toBeTruthy()
        expect(response.headers?.find(header => header.name == 'Set-Cookie')).toBeTruthy()

    })

    it('should be able to receive a status code 401 with a invalid password', async () => {

        const response = await authenticateUserController.handle({
            body: {
                email: 'email@mail.com',
                password: 'Password456.'
            },
            headers: {},
            query: {}
        })

        expect(response.body.name).toBe('IncorrectEmailOrPassword')
        expect(response.code).toBe(401)

    })

    it('should be able to receive a status code 400 with invalid parameters', async () => {

        const response = await authenticateUserController.handle({
            body: {
                email: 'email@mail.com'
            },
            headers: {},
            query: {}
        })

        expect(response.body.name).toBe('InvalidParameters')
        expect(response.code).toBe(400)

    })

})