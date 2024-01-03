import { AccessTokenService } from "../external/services/access-token-service"
import { UserRepository } from "../external/repositories/user-repository"
import { InvalidToken } from "../external/services/errors/invalid-token"
import { UserNotFound } from "./errors/user-not-found"
import { Either, left, right } from "../shared/either"
import { User } from "../domain/user/user"

export interface GetUserByAccessTokenRequest {
    accessToken: string
}

export class GetUserByAccessTokenUseCase {

    private readonly accessTokenService: AccessTokenService
    private readonly userRepository: UserRepository

    constructor(accessTokenService: AccessTokenService, userRepository: UserRepository) {
        this.accessTokenService = accessTokenService
        this.userRepository = userRepository
    }

    async execute({ accessToken }: GetUserByAccessTokenRequest): Promise<Either<UserNotFound | InvalidToken, User>> {

        if (!accessToken || !accessToken.length)
            return left(new InvalidToken())

        const userIdOrError = await this.accessTokenService.verify(accessToken)

        if (userIdOrError.isLeft())
            return left(new InvalidToken())
        
        const userId = userIdOrError.value

        const userOrUndefined = await this.userRepository.findById(userId)

        if (!userOrUndefined)
            return left(new UserNotFound())
        
        return right(userOrUndefined)

    }

}