import { authenticateUserUsecase } from "../../domain/usecases/authenticate-user-usecase-factory"
import { createUserUseCase } from "../../domain/usecases/create-user-usecase-factory"
import { CreateUserController } from "../../../../application/controllers/create-user-controller"

export const createUserController = new CreateUserController(authenticateUserUsecase, createUserUseCase)