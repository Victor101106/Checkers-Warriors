import { InMemoryUserRepository } from "../../external/repositories/in-memory/in-memory-user-repository"
import { jwtAccessTokenService } from "../../external/services/factory/access-token-service-factory"
import { bcryptPasswordService } from "../../external/services/factory/password-service-factory"
import { uuidUniqueIdService } from "../../external/services/factory/unique-id-service-factory"
import { AuthenticateUserUseCase } from "../../usecases/authenticate-user-usecase"
import { CreateUserUseCase } from "../../usecases/create-user-usecase"
import { CreateUserController } from "./create-user-controller"
import { describe, expect, it } from "vitest"
import { config } from "dotenv"

describe('Create user controller', () => {

    config()

    const inMemoryUserRepository = new InMemoryUserRepository()
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordService, uuidUniqueIdService, inMemoryUserRepository)
    const authenticateUserUseCase = new AuthenticateUserUseCase(jwtAccessTokenService, bcryptPasswordService, inMemoryUserRepository)
    const createUserController = new CreateUserController(authenticateUserUseCase, createUserUseCase)

    it('should be able to receive a status code 201 to create a valid user', async () => {

        const response = await createUserController.handle({
            body: {
                password: 'Password123.',
                email: 'email@mail.com',
                name: 'Name'
            },
            headers: {},
            query: {}
        })

        expect(response.code).toBe(201)
        expect(response.body.auth).toBeTruthy()
        expect(response.headers?.find(header => header.name == 'Set-Cookie')).toBeTruthy()

    })

    it('should be able to receive a status code 400 with invalid parameters', async () => {

        const response = await createUserController.handle({
            body: {
                password: 'Password123.',
                name: 'Name'
            },
            headers: {},
            query: {}
        })

        expect(response.body.name).toBe('InvalidParameters')
        expect(response.code).toBe(400)

    })

})