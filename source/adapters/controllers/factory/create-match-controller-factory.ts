import { getUserByAccessTokenUseCase } from "../../../usecases/factory/get-user-by-access-token-usecase-factory"
import { createMatchUseCase } from "../../../usecases/factory/create-match-usecase-factory"
import { CreateMatchController } from "../create-match-controller"

export const createMatchController = new CreateMatchController(getUserByAccessTokenUseCase, createMatchUseCase)