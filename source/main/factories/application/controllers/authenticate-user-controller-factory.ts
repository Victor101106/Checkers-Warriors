import { authenticateUserUsecase } from "../../domain/usecases/authenticate-user-usecase-factory"
import { AuthenticateUserController } from "../../../../application/controllers/authenticate-user-controller"

export const authenticateUserController = new AuthenticateUserController(authenticateUserUsecase)