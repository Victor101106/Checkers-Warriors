import { FindAllPlayerCorrectMovementsUseCase } from "../find-all-player-correct-movements-usecase"
import { findMovementsUseCase } from "./find-correct-movements-usecase-factory"
import { createMovementTreeUseCase } from "./create-movement-tree-usecase-factory"

export const findAllPlayerCorrectMovementsUseCase = new FindAllPlayerCorrectMovementsUseCase(findMovementsUseCase, createMovementTreeUseCase)