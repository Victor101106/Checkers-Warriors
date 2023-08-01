import { inMemoryUserRepository } from "../../external/repositories/factory/user-repository-factory"
import { jwtAccessTokenService } from "../../external/services/factory/access-token-service-factory"
import { GetUserByHttpCookieUseCase } from "../get-user-by-http-cookie-usecase"

export const getUserByHttpCookieUseCase = new GetUserByHttpCookieUseCase(jwtAccessTokenService, inMemoryUserRepository)