import { FindCorrectMovementUseCase } from "../find-correct-movements-usecase"
import { findMovementUseCase } from "./find-movement-usecase-factory"

export const findCorrectMovementsUseCase = new FindCorrectMovementUseCase(findMovementUseCase)