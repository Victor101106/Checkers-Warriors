import { InMemoryUserRepository } from "../../external/repositories/in-memory/in-memory-user-repository"
import { bcryptPasswordGateway } from "../../external/gateways/factory/password-gateway-factory"
import { uuidUniqueIdGateway } from "../../external/gateways/factory/unique-id-gateway-factory"
import { InvalidPassword } from "../entities/user/errors/invalid-password"
import { EmailAlreadyInUse } from "./errors/email-already-in-use"
import { CreateUserUseCase } from "./create-user-usecase"
import { Left, Right } from "../../shared/either"
import { describe, expect, it } from "vitest"
import { User } from "../entities/user/user"

describe('Create user use case', () => {

    const inMemoryUserRepository = new InMemoryUserRepository()
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordGateway, uuidUniqueIdGateway, inMemoryUserRepository)

    it('should be able to create and save a user', async () => {

        const userOrError = await createUserUseCase.execute({
            password: 'Password123.',
            email: 'email@mail.com',
            name: 'Name'
        })

        expect(userOrError).instanceOf(Right)

        const user = userOrError.value as User

        const userOrUndefined = await inMemoryUserRepository.findById(user.id.value)

        expect(userOrUndefined).toBe(user)

    })

    it('should not be able to create a user with a used email', async () => {

        const userOrError = await createUserUseCase.execute({
            password: 'Password456.',
            email: 'email@mail.com',
            name: 'Name'
        })

        expect(userOrError).instanceOf(Left)
        expect(userOrError.value).instanceOf(EmailAlreadyInUse)

    })

    it('should not be able to create a user with a invalid password', async () => {

        const userOrError = await createUserUseCase.execute({
            password: 'Password789',
            email: 'email2@mail.com',
            name: 'Name'
        })

        expect(userOrError).instanceOf(Left)
        expect(userOrError.value).instanceOf(InvalidPassword)

    })


})