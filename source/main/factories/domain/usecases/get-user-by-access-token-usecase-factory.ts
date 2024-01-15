import { inMemoryUserRepository } from "../../infra/repositories/user-repository-factory"
import { jwtAccessTokenGateway } from "../../infra/gateways/access-token-gateway-factory"
import { GetUserByAccessTokenUseCase } from "../../../../domain/usecases/get-user-by-access-token-usecase"

export const getUserByAccessTokenUseCase = new GetUserByAccessTokenUseCase(jwtAccessTokenGateway, inMemoryUserRepository)