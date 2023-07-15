import { inMemoryUserRepository } from "../../external/repositories/factory/user-repository-factory"
import { bcryptPasswordService } from "../../external/services/factory/password-service-factory"
import { uuidUniqueIdService } from "../../external/services/factory/unique-id-service-factory"
import { CreateUserUseCase } from "../create-user-usecase"

export const createUserUseCase = new CreateUserUseCase(bcryptPasswordService, uuidUniqueIdService, inMemoryUserRepository)