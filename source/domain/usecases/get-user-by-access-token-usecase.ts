import { AccessTokenGateway } from "../../external/gateways/access-token-gateway"
import { UserRepository } from "../../external/repositories/user-repository"
import { InvalidToken } from "../../external/gateways/errors/invalid-token"
import { UserNotFound } from "./errors/user-not-found"
import { Either, left, right } from "../../shared/either"
import { User } from "../entities/user/user"

export interface GetUserByAccessTokenRequest {
    accessToken: string
}

export class GetUserByAccessTokenUseCase {

    private readonly accessTokenGateway: AccessTokenGateway
    private readonly userRepository: UserRepository

    constructor(accessTokenGateway: AccessTokenGateway, userRepository: UserRepository) {
        this.accessTokenGateway = accessTokenGateway
        this.userRepository = userRepository
    }

    async execute({ accessToken }: GetUserByAccessTokenRequest): Promise<Either<UserNotFound | InvalidToken, User>> {

        if (!accessToken || !accessToken.length)
            return left(new InvalidToken())

        const userIdOrError = await this.accessTokenGateway.verify(accessToken)

        if (userIdOrError.isLeft())
            return left(new InvalidToken())
        
        const userId = userIdOrError.value

        const userOrUndefined = await this.userRepository.findById(userId)

        if (!userOrUndefined)
            return left(new UserNotFound())
        
        return right(userOrUndefined)

    }

}