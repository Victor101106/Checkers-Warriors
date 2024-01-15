import { inMemoryUserRepository } from "../../../external/repositories/factory/user-repository-factory"
import { jwtAccessTokenGateway } from "../../../external/gateways/factory/access-token-gateway-factory"
import { GetUserByAccessTokenUseCase } from "../get-user-by-access-token-usecase"

export const getUserByAccessTokenUseCase = new GetUserByAccessTokenUseCase(jwtAccessTokenGateway, inMemoryUserRepository)