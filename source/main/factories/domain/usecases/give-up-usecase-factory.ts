import { inMemoryMatchRepository } from "../../infra/repositories/match-repository-factory"
import { GiveUpUseCase } from "../../../../domain/usecases/give-up-usecase"

export const giveUpUseCase = new GiveUpUseCase(inMemoryMatchRepository)