import { createUserUseCase } from "../../../usecases/factory/create-user-usecase-factory"
import { CreateUserController } from "../create-user-controller"

export const createUserController = new CreateUserController(createUserUseCase)