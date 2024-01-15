import { inMemoryMatchRepository } from "../../../external/repositories/factory/match-repository-factory"
import { inMemoryUserRepository } from "../../../external/repositories/factory/user-repository-factory"
import { JoinMatchUseCase } from "../join-match-usecase"

export const joinMatchUseCase = new JoinMatchUseCase(inMemoryMatchRepository, inMemoryUserRepository)