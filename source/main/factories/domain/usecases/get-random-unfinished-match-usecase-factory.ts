import { GetRandomUnfinishedMatchUseCase } from "../../../../domain/usecases/get-random-unfinished-match-usecase"
import { inMemoryMatchRepository } from "../../infra/repositories/match-repository-factory"

export const getRandomUnfinishedMatchUseCase = new GetRandomUnfinishedMatchUseCase(inMemoryMatchRepository)