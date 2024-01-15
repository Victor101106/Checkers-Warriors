import { inMemoryUserRepository } from "../../infra/repositories/user-repository-factory"
import { bcryptPasswordGateway } from "../../infra/gateways/password-gateway-factory"
import { uuidUniqueIdGateway } from "../../infra/gateways/unique-id-gateway-factory"
import { CreateUserUseCase } from "../../../../domain/usecases/create-user-usecase"

export const createUserUseCase = new CreateUserUseCase(bcryptPasswordGateway, uuidUniqueIdGateway, inMemoryUserRepository)