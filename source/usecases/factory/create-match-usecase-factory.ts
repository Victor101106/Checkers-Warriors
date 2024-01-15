import { inMemoryMatchRepository } from "../../external/repositories/factory/match-repository-factory"
import { inMemoryUserRepository } from "../../external/repositories/factory/user-repository-factory"
import { uuidUniqueIdGateway } from "../../external/gateways/factory/unique-id-gateway-factory"
import { createBrazilianBoardUseCase } from "./create-board-usecase-factory"
import { CreateMatchUseCase } from "../create-match-usecase"

export const createMatchUseCase = new CreateMatchUseCase([
    createBrazilianBoardUseCase
], uuidUniqueIdGateway, inMemoryMatchRepository, inMemoryUserRepository)