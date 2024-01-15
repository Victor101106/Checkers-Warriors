import { inMemoryUserRepository } from "../../../infra/repositories/factory/user-repository-factory"
import { jwtAccessTokenGateway } from "../../../infra/gateways/factory/access-token-gateway-factory"
import { bcryptPasswordGateway } from "../../../infra/gateways/factory/password-gateway-factory"
import { AuthenticateUserUseCase } from "../authenticate-user-usecase"

export const authenticateUserUsecase = new AuthenticateUserUseCase(jwtAccessTokenGateway, bcryptPasswordGateway, inMemoryUserRepository)