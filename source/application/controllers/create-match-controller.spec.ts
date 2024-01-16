import { InMemoryMatchRepository } from "../../infra/repositories/in-memory-match-repository"
import { InMemoryUserRepository } from "../../infra/repositories/in-memory-user-repository"
import { createBrazilianBoardUseCase } from "../../main/factories/domain/usecases/create-board-usecase-factory"
import { bcryptPasswordGateway } from "../../main/factories/infra/gateways/password-gateway-factory"
import { uuidUniqueIdGateway } from "../../main/factories/infra/gateways/unique-id-gateway-factory"
import { CreateMatchUseCase } from "../../domain/usecases/create-match-usecase"
import { CreateUserUseCase } from "../../domain/usecases/create-user-usecase"
import { CreateMatchController } from "./create-match-controller"
import { describe, expect, it } from "vitest"
import { Right } from "../../shared/either"
import { User } from "../../domain/entities/user/user"

describe('Create match controller', async () => {

    const inMemoryMatchRepository = new InMemoryMatchRepository()
    const inMemoryUserRepository = new InMemoryUserRepository()

    const createMatchUseCase = new CreateMatchUseCase([ createBrazilianBoardUseCase ], uuidUniqueIdGateway, inMemoryMatchRepository, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordGateway, uuidUniqueIdGateway, inMemoryUserRepository)
    const createMatchController = new CreateMatchController(createMatchUseCase)

    const createdUserOrError = await createUserUseCase.execute({
        password: 'Password123.',
        email: 'email@mail.com',
        name: 'Name'
    })

    expect(createdUserOrError).instanceOf(Right)

    const userId = (createdUserOrError.value as User).id.value

    it('should be able to receive a status code 201 to create a match', async () => {

        const response = await createMatchController.handle({
            body: { variation: 'brazilian', userId },
            headers: { },
            query: {}
        })

        expect(response.code).toBe(201)
        expect(response.body.id).toBeTruthy()

    })

    it('should be able to receive a status code 400 to create a match with invalid parameters', async () => {

        const response = await createMatchController.handle({
            headers: {},
            query: {},
            body: {}
        })

        expect(response.code).toBe(400)
        expect(response.body.name).toBe('RequiredFieldError')

    })

    it('should be able to receive a status code 401 to create a match with a invalid user id', async () => {

        const response = await createMatchController.handle({
            body: { variation: 'brazilian', userId: 'any' },
            headers: {},
            query: {}
        })

        expect(response.code).toBe(400)
        expect(response.body.name).toBe('UserNotFound')

    })

})