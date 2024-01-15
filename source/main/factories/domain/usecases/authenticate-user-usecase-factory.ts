import { inMemoryUserRepository } from "../../infra/repositories/user-repository-factory"
import { jwtAccessTokenGateway } from "../../infra/gateways/access-token-gateway-factory"
import { bcryptPasswordGateway } from "../../infra/gateways/password-gateway-factory"
import { AuthenticateUserUseCase } from "../../../../domain/usecases/authenticate-user-usecase"

export const authenticateUserUsecase = new AuthenticateUserUseCase(jwtAccessTokenGateway, bcryptPasswordGateway, inMemoryUserRepository)