import { inMemoryMatchRepository } from "../../external/repositories/factory/match-repository-factory"
import { inMemoryUserRepository } from "../../external/repositories/factory/user-repository-factory"
import { uuidUniqueIdService } from "../../external/services/factory/unique-id-service-factory"
import { createBrazilianBoardUseCase } from "./create-board-usecase-factory"
import { CreateMatchUseCase } from "../create-match-usecase"

export const createMatchUseCase = new CreateMatchUseCase([
    createBrazilianBoardUseCase
], uuidUniqueIdService, inMemoryMatchRepository, inMemoryUserRepository)