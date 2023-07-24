import { authenticateUserUsecase } from "../../../usecases/factory/authenticate-user-usecase-factory"
import { AuthenticateUserController } from "../authenticate-user-controller"

export const authenticateUserController = new AuthenticateUserController(authenticateUserUsecase)