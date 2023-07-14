import { InMemoryUserRepository } from "../external/repositories/in-memory/in-memory-user-repository"
import { JwtAccessTokenService } from "../external/services/adapters/jwt-access-token-service"
import { BcryptPasswordService } from "../external/services/adapters/bcrypt-password-service"
import { UuidUniqueIdService } from "../external/services/adapters/uuid-unique-id-service"
import { GetUserByAccessTokenUseCase } from "./get-user-by-access-token-usecase"
import { AuthenticateUserUseCase } from "./authenticate-user-usecase"
import { CreateUserUseCase } from "./create-user-usecase"
import { describe, it, expect, beforeAll } from "vitest"
import { UserNotFound } from "./errors/user-not-found"
import { config as configureDotEnv } from "dotenv"
import { Left, Right } from "../shared/either"

describe('Get user by access token use case', async () => {

    const inMemoryUserRepository = new InMemoryUserRepository()
    const jwtAccessTokenService = new JwtAccessTokenService()
    const bcryptPasswordService = new BcryptPasswordService()
    const uuidUniqueIdService = new UuidUniqueIdService()

    const authenticateUserUseCase = new AuthenticateUserUseCase(jwtAccessTokenService, bcryptPasswordService, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordService, uuidUniqueIdService, inMemoryUserRepository)
    const getUserByAccessTokenUseCase = new GetUserByAccessTokenUseCase(jwtAccessTokenService, inMemoryUserRepository)

    beforeAll(() => { configureDotEnv() })    

    it('should be able to ensure authentication and get user', async () => {
        
        const userOrError = await createUserUseCase.execute({
            password: 'Password123.',
            email: 'email@mail.com',
            name: 'Name'
        })
        
        expect(userOrError).instanceOf(Right)
    
        const accessTokenOrError = await authenticateUserUseCase.execute({
            password: 'Password123.',
            email: 'email@mail.com'
        })
    
        expect(accessTokenOrError).instanceOf(Right)

        const accessToken = accessTokenOrError.value as string
        const authenticatedUserOrError = await getUserByAccessTokenUseCase.execute({ accessToken })
        
        expect(authenticatedUserOrError).instanceOf(Right)
        expect(authenticatedUserOrError.value).toBe(userOrError.value)

    })

    it('should not be able to ensure authentication with a user that does not exist', async () => {
        
        const simulatedUserId: string = 'd02d9324-f819-4ea8-9f51-1115d43b1da2'
        const accessToken = await jwtAccessTokenService.generate(simulatedUserId)

        const authenticatedUserOrError = await getUserByAccessTokenUseCase.execute({ accessToken })
        
        expect(authenticatedUserOrError).instanceOf(Left)
        expect(authenticatedUserOrError.value).instanceOf(UserNotFound)

    })

})