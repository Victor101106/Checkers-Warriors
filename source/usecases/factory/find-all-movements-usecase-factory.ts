import { FindAllMovementsUseCase } from "../find-all-movements-usecase"
import { findMovementsUseCase } from "./find-movements-usecase-factory"
import { createMovementTreeUseCase } from "./create-movement-tree-usecase-factory"

export const findAllMovementsUseCase = new FindAllMovementsUseCase(findMovementsUseCase, createMovementTreeUseCase)