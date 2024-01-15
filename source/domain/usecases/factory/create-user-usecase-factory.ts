import { inMemoryUserRepository } from "../../../infra/repositories/factory/user-repository-factory"
import { bcryptPasswordGateway } from "../../../infra/gateways/factory/password-gateway-factory"
import { uuidUniqueIdGateway } from "../../../infra/gateways/factory/unique-id-gateway-factory"
import { CreateUserUseCase } from "../create-user-usecase"

export const createUserUseCase = new CreateUserUseCase(bcryptPasswordGateway, uuidUniqueIdGateway, inMemoryUserRepository)