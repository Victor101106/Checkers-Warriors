import { inMemoryUserRepository } from "../../external/repositories/factory/user-repository-factory"
import { jwtAccessTokenService } from "../../external/services/factory/access-token-service-factory"
import { bcryptPasswordService } from "../../external/services/factory/password-service-factory"
import { AuthenticateUserUseCase } from "../authenticate-user-usecase"

export const authenticateUserUsecase = new AuthenticateUserUseCase(jwtAccessTokenService, bcryptPasswordService, inMemoryUserRepository)