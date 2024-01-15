import { inMemoryMatchRepository } from "../../infra/repositories/match-repository-factory"
import { FindAllMovementsOnMatchUseCase } from "../../../../domain/usecases/find-all-movements-on-match-usecase"
import { findAllBrazilianMovementsUseCase } from "./find-all-movements-usecase-factory"

export const findAllMovementsOnMatchUseCase = new FindAllMovementsOnMatchUseCase([
    findAllBrazilianMovementsUseCase
], inMemoryMatchRepository)