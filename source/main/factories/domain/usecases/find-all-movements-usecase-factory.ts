import { FindAllBrazilianMovementsUseCase } from "../../../../domain/usecases/adapters/find-all-movements/find-all-brazilian-movements"
import { createMovementTreeUseCase } from "./create-movement-tree-usecase-factory"
import { findMovementsUseCase } from "./find-movements-usecase-factory"

export const findAllBrazilianMovementsUseCase = new FindAllBrazilianMovementsUseCase(findMovementsUseCase, createMovementTreeUseCase)