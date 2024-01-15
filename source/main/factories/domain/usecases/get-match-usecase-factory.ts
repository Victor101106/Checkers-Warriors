import { inMemoryMatchRepository } from "../../infra/repositories/match-repository-factory"
import { GetMatchUseCase } from "../../../../domain/usecases/get-match-usecase"

export const getMatchUseCase = new GetMatchUseCase(inMemoryMatchRepository)