import { createMatchUseCase } from "../../domain/usecases/create-match-usecase-factory"
import { CreateMatchController } from "../../../../application/controllers/create-match-controller"

export const createMatchController = new CreateMatchController(createMatchUseCase)