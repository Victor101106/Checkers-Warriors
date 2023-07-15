import { findMovementByQuantityRuleUseCase } from "./find-movement-by-rule-usecase-factory"
import { FindCorrectMovementUseCase } from "../find-correct-movements-usecase"

export const findCorrectMovementsByQuantityRuleUseCase = new FindCorrectMovementUseCase(findMovementByQuantityRuleUseCase)