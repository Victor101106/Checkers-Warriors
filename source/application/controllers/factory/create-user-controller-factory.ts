import { authenticateUserUsecase } from "../../../domain/usecases/factory/authenticate-user-usecase-factory"
import { createUserUseCase } from "../../../domain/usecases/factory/create-user-usecase-factory"
import { CreateUserController } from "../create-user-controller"

export const createUserController = new CreateUserController(authenticateUserUsecase, createUserUseCase)