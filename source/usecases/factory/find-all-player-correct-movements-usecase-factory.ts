import { findCorrectMovementsByQuantityRuleUseCase } from "./find-correct-movements-usecase-factory"
import { FindAllPlayerCorrectMovementsUseCase } from "../find-all-player-correct-movements-usecase"
import { createMovementTreeUseCase } from "./create-movement-tree-usecase-factory"

export const findAllPlayerCorrectMovementsByQuantityRuleUseCase = new FindAllPlayerCorrectMovementsUseCase(findCorrectMovementsByQuantityRuleUseCase, createMovementTreeUseCase)