import { inMemoryUserRepository } from "../../../external/repositories/factory/user-repository-factory"
import { bcryptPasswordGateway } from "../../../external/gateways/factory/password-gateway-factory"
import { uuidUniqueIdGateway } from "../../../external/gateways/factory/unique-id-gateway-factory"
import { CreateUserUseCase } from "../create-user-usecase"

export const createUserUseCase = new CreateUserUseCase(bcryptPasswordGateway, uuidUniqueIdGateway, inMemoryUserRepository)