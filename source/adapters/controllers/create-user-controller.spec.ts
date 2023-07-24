import { InMemoryUserRepository } from "../../external/repositories/in-memory/in-memory-user-repository"
import { bcryptPasswordService } from "../../external/services/factory/password-service-factory"
import { uuidUniqueIdService } from "../../external/services/factory/unique-id-service-factory"
import { CreateUserUseCase } from "../../usecases/create-user-usecase"
import { CreateUserController } from "./create-user-controller"
import { describe, expect, it } from "vitest"

describe('Create user controller', () => {

    const inMemoryUserRepository = new InMemoryUserRepository()
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordService, uuidUniqueIdService, inMemoryUserRepository)
    const createUserController = new CreateUserController(createUserUseCase)

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