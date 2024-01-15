import { inMemoryMatchRepository } from "../../../infra/repositories/factory/match-repository-factory"
import { GiveUpUseCase } from "../give-up-usecase"

export const giveUpUseCase = new GiveUpUseCase(inMemoryMatchRepository)