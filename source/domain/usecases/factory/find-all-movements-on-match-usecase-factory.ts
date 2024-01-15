import { inMemoryMatchRepository } from "../../../infra/repositories/factory/match-repository-factory"
import { FindAllMovementsOnMatchUseCase } from "../find-all-movements-on-match-usecase"
import { findAllBrazilianMovementsUseCase } from "./find-all-movements-usecase-factory"

export const findAllMovementsOnMatchUseCase = new FindAllMovementsOnMatchUseCase([
    findAllBrazilianMovementsUseCase
], inMemoryMatchRepository)