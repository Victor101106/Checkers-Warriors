import { inMemoryMatchRepository } from "../../../external/repositories/factory/match-repository-factory"
import { GetMatchUseCase } from "../get-match-usecase"

export const getMatchUseCase = new GetMatchUseCase(inMemoryMatchRepository)