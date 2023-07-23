import { FindAllPlayerCorrectMovementsUseCase } from "../find-all-player-correct-movements-usecase"
import { findCorrectMovementsUseCase } from "./find-correct-movements-usecase-factory"
import { createMovementTreeUseCase } from "./create-movement-tree-usecase-factory"

export const findAllPlayerCorrectMovementsByQuantityRuleUseCase = new FindAllPlayerCorrectMovementsUseCase(findCorrectMovementsUseCase, createMovementTreeUseCase)