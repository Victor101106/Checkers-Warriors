import { AccessTokenService } from "../external/services/access-token-service"
import { UserRepository } from "../external/repositories/user-repository"
import { InvalidToken } from "../external/services/errors/invalid-token"
import { UserNotFound } from "./errors/user-not-found"
import { Either, left, right } from "../shared/either"
import { User } from "../domain/user/user"
import { HttpRequestHeaders } from "../adapters/controllers/ports/http-headers"
import { parseCookies } from "../adapters/controllers/helpers/cookie-helper"

export interface GetUserByHttpCookieRequest {
    headers: HttpRequestHeaders
}

export class GetUserByHttpCookieUseCase {

    private readonly accessTokenService: AccessTokenService
    private readonly userRepository: UserRepository

    constructor(accessTokenService: AccessTokenService, userRepository: UserRepository) {
        this.accessTokenService = accessTokenService
        this.userRepository = userRepository
    }

    async execute({ headers }: GetUserByHttpCookieRequest): Promise<Either<UserNotFound | InvalidToken, User>> {

        const cookieHeader = headers.cookie

        if (!cookieHeader)
            return left(new InvalidToken())
        
        const parsedCookie = parseCookies(cookieHeader)
        const accessToken = parsedCookie['access-token']

        const userIdOrError = await this.accessTokenService.verify(accessToken || String())

        if (userIdOrError.isLeft())
            return left(new InvalidToken())
        
        const userId = userIdOrError.value

        const userOrUndefined = await this.userRepository.findById(userId)

        if (!userOrUndefined)
            return left(new UserNotFound())
        
        return right(userOrUndefined)

    }

}