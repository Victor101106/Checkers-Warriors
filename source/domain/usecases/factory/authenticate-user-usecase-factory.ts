import { inMemoryUserRepository } from "../../../external/repositories/factory/user-repository-factory"
import { jwtAccessTokenGateway } from "../../../external/gateways/factory/access-token-gateway-factory"
import { bcryptPasswordGateway } from "../../../external/gateways/factory/password-gateway-factory"
import { AuthenticateUserUseCase } from "../authenticate-user-usecase"

export const authenticateUserUsecase = new AuthenticateUserUseCase(jwtAccessTokenGateway, bcryptPasswordGateway, inMemoryUserRepository)