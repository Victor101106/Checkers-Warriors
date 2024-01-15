import { InMemoryUserRepository } from "../../infra/repositories/in-memory/in-memory-user-repository"
import { jwtAccessTokenGateway } from "../../main/factories/infra/gateways/access-token-gateway-factory"
import { bcryptPasswordGateway } from "../../main/factories/infra/gateways/password-gateway-factory"
import { uuidUniqueIdGateway } from "../../main/factories/infra/gateways/unique-id-gateway-factory"
import { AuthenticateUserUseCase } from "../../domain/usecases/authenticate-user-usecase"
import { CreateUserUseCase } from "../../domain/usecases/create-user-usecase"
import { CreateUserController } from "./create-user-controller"
import { describe, expect, it } from "vitest"

describe('Create user controller', () => {

    const inMemoryUserRepository = new InMemoryUserRepository()
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordGateway, uuidUniqueIdGateway, inMemoryUserRepository)
    const authenticateUserUseCase = new AuthenticateUserUseCase(jwtAccessTokenGateway, bcryptPasswordGateway, inMemoryUserRepository)
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