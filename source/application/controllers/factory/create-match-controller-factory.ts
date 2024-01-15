import { createMatchUseCase } from "../../../domain/usecases/factory/create-match-usecase-factory"
import { CreateMatchController } from "../create-match-controller"

export const createMatchController = new CreateMatchController(createMatchUseCase)