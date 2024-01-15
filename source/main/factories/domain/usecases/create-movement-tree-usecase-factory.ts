import { createTrajectoryUseCase } from "./create-trajectory-usecase-factory"
import { CreateMovementTreeUseCase } from "../../../../domain/usecases/create-movement-tree-usecase"

export const createMovementTreeUseCase = new CreateMovementTreeUseCase(createTrajectoryUseCase)