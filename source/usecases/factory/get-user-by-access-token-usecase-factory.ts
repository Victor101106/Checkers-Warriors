import { inMemoryUserRepository } from "../../external/repositories/factory/user-repository-factory"
import { jwtAccessTokenService } from "../../external/services/factory/access-token-service-factory"
import { GetUserByAccessTokenUseCase } from "../get-user-by-access-token-usecase"

export const getUserByAccessTokenUseCase = new GetUserByAccessTokenUseCase(jwtAccessTokenService, inMemoryUserRepository)