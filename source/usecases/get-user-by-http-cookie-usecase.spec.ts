import { InMemoryUserRepository } from "../external/repositories/in-memory/in-memory-user-repository"
import { jwtAccessTokenService } from "../external/services/factory/access-token-service-factory"
import { bcryptPasswordService } from "../external/services/factory/password-service-factory"
import { uuidUniqueIdService } from "../external/services/factory/unique-id-service-factory"
import { GetUserByHttpCookieUseCase } from "./get-user-by-http-cookie-usecase"
import { InvalidToken } from "../external/services/errors/invalid-token"
import { AuthenticateUserUseCase } from "./authenticate-user-usecase"
import { CreateUserUseCase } from "./create-user-usecase"
import { describe, it, expect } from "vitest"
import { UserNotFound } from "./errors/user-not-found"
import { Left, Right } from "../shared/either"

describe('Get user by http cookie use case', async () => {

    const inMemoryUserRepository = new InMemoryUserRepository()

    const authenticateUserUseCase = new AuthenticateUserUseCase(jwtAccessTokenService, bcryptPasswordService, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordService, uuidUniqueIdService, inMemoryUserRepository)
    const getUserByHttpCookieUseCase = new GetUserByHttpCookieUseCase(jwtAccessTokenService, inMemoryUserRepository)

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
        const authenticatedUserOrError = await getUserByHttpCookieUseCase.execute({ headers: {
            'cookie': `access-token=${accessToken}`
        }})
        
        expect(authenticatedUserOrError).instanceOf(Right)
        expect(authenticatedUserOrError.value).toBe(userOrError.value)

    })

    it('should not be able to ensure authentication with a user that does not exist', async () => {
        
        const simulatedUserId: string = 'd02d9324-f819-4ea8-9f51-1115d43b1da2'
        const accessToken = await jwtAccessTokenService.generate(simulatedUserId)

        const authenticatedUserOrError = await getUserByHttpCookieUseCase.execute({ headers: {
            'cookie': `access-token=${accessToken}`
        }})
        
        expect(authenticatedUserOrError).instanceOf(Left)
        expect(authenticatedUserOrError.value).instanceOf(UserNotFound)

    })

    it('should not be able to ensure authentication without http cookie', async () => {

        const authenticatedUserOrError = await getUserByHttpCookieUseCase.execute({ headers: {} })
        
        expect(authenticatedUserOrError).instanceOf(Left)
        expect(authenticatedUserOrError.value).instanceOf(InvalidToken)

    })

})