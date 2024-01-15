import { InMemoryUserRepository } from "../external/repositories/in-memory/in-memory-user-repository"
import { jwtAccessTokenGateway } from "../external/gateways/factory/access-token-gateway-factory"
import { bcryptPasswordGateway } from "../external/gateways/factory/password-gateway-factory"
import { uuidUniqueIdGateway } from "../external/gateways/factory/unique-id-gateway-factory"
import { InvalidToken } from "../external/gateways/errors/invalid-token"
import { AuthenticateUserUseCase } from "./authenticate-user-usecase"
import { CreateUserUseCase } from "./create-user-usecase"
import { describe, it, expect } from "vitest"
import { UserNotFound } from "./errors/user-not-found"
import { Left, Right } from "../shared/either"
import { GetUserByAccessTokenUseCase } from "./get-user-by-access-token-usecase"

describe('Get user by access token use case', async () => {

    const inMemoryUserRepository = new InMemoryUserRepository()

    const authenticateUserUseCase = new AuthenticateUserUseCase(jwtAccessTokenGateway, bcryptPasswordGateway, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordGateway, uuidUniqueIdGateway, inMemoryUserRepository)
    const getUserByAccessTokenUseCase = new GetUserByAccessTokenUseCase(jwtAccessTokenGateway, inMemoryUserRepository)

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
        const accessToken = await jwtAccessTokenGateway.generate(simulatedUserId)

        const authenticatedUserOrError = await getUserByAccessTokenUseCase.execute({ accessToken })
        
        expect(authenticatedUserOrError).instanceOf(Left)
        expect(authenticatedUserOrError.value).instanceOf(UserNotFound)

    })

    it('should not be able to ensure authentication with a empty access token', async () => {
        
        const authenticatedUserOrError = await getUserByAccessTokenUseCase.execute({ accessToken: '' })
        
        expect(authenticatedUserOrError).instanceOf(Left)
        expect(authenticatedUserOrError.value).instanceOf(InvalidToken)

    })

})