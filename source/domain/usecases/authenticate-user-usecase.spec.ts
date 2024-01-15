import { InMemoryUserRepository } from "../../infra/repositories/in-memory/in-memory-user-repository"
import { jwtAccessTokenGateway } from "../../main/factories/infra/gateways/access-token-gateway-factory"
import { bcryptPasswordGateway } from "../../main/factories/infra/gateways/password-gateway-factory"
import { uuidUniqueIdGateway } from "../../main/factories/infra/gateways/unique-id-gateway-factory"
import { IncorrectEmailOrPassword } from "./errors/incorrect-email-or-password"
import { AuthenticateUserUseCase } from "./authenticate-user-usecase"
import { CreateUserUseCase } from "./create-user-usecase"
import { describe, it, expect } from "vitest"
import { Left, Right } from "../../shared/either"

describe('Authenticate user use case', async () => {

    const inMemoryUserRepository = new InMemoryUserRepository()
    const authenticateUserUseCase = new AuthenticateUserUseCase(jwtAccessTokenGateway, bcryptPasswordGateway, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordGateway, uuidUniqueIdGateway, inMemoryUserRepository)

    const userOrError = await createUserUseCase.execute({
        password: 'Password123.',
        email: 'email@mail.com',
        name: 'Name'
    })
    
    expect(userOrError).instanceOf(Right)

    it('should be able to authenticate a user', async () => {
        
        const accessTokenOrError = await authenticateUserUseCase.execute({ email: 'email@mail.com', password: 'Password123.' })

        expect(accessTokenOrError).instanceOf(Right)

    })

    it('should not be able to authenticate a user with a invalid password', async () => {
        
        const accessTokenOrError = await authenticateUserUseCase.execute({ email: 'email@mail.com', password: 'Password456.' })

        expect(accessTokenOrError).instanceOf(Left)
        expect(accessTokenOrError.value).instanceOf(IncorrectEmailOrPassword)

    })

    it('should not be able to authenticate a user with a invalid email', async () => {
        
        const accessTokenOrError = await authenticateUserUseCase.execute({ email: 'invalidemail@mail.com', password: 'Password123.' })

        expect(accessTokenOrError).instanceOf(Left)
        expect(accessTokenOrError.value).instanceOf(IncorrectEmailOrPassword)

    })

})