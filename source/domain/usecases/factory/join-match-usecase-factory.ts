import { inMemoryMatchRepository } from "../../../infra/repositories/factory/match-repository-factory"
import { inMemoryUserRepository } from "../../../infra/repositories/factory/user-repository-factory"
import { JoinMatchUseCase } from "../join-match-usecase"

export const joinMatchUseCase = new JoinMatchUseCase(inMemoryMatchRepository, inMemoryUserRepository)