import { InMemoryUserRepository } from "../external/repositories/in-memory/in-memory-user-repository"
import { JwtAccessTokenService } from "../external/services/adapters/jwt-access-token-service"
import { BcryptPasswordService } from "../external/services/adapters/bcrypt-password-service"
import { UuidUniqueIdService } from "../external/services/adapters/uuid-unique-id-service"
import { IncorrectEmailOrPassword } from "./errors/incorrect-email-or-password"
import { AuthenticateUserUseCase } from "./authenticate-user-usecase"
import { CreateUserUseCase } from "./create-user-usecase"
import { describe, it, expect, beforeAll } from "vitest"
import { config as configureDotEnv } from "dotenv"
import { Left, Right } from "../shared/either"

describe('Authenticate user use case', async () => {

    const inMemoryUserRepository = new InMemoryUserRepository()
    const jwtAccessTokenService = new JwtAccessTokenService()
    const bcryptPasswordService = new BcryptPasswordService()
    const uuidUniqueIdService = new UuidUniqueIdService()
    const authenticateUserUseCase = new AuthenticateUserUseCase(jwtAccessTokenService, bcryptPasswordService, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordService, uuidUniqueIdService, inMemoryUserRepository)

    const userOrError = await createUserUseCase.execute({
        password: 'Password123.',
        email: 'email@mail.com',
        name: 'Name'
    })
    
    expect(userOrError).instanceOf(Right)
    beforeAll(() => { configureDotEnv() })

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