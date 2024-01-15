import { inMemoryMatchRepository } from "../../infra/repositories/match-repository-factory"
import { inMemoryUserRepository } from "../../infra/repositories/user-repository-factory"
import { JoinMatchUseCase } from "../../../../domain/usecases/join-match-usecase"

export const joinMatchUseCase = new JoinMatchUseCase(inMemoryMatchRepository, inMemoryUserRepository)