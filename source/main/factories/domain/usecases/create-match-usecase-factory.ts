import { inMemoryMatchRepository } from "../../infra/repositories/match-repository-factory"
import { inMemoryUserRepository } from "../../infra/repositories/user-repository-factory"
import { uuidUniqueIdGateway } from "../../infra/gateways/unique-id-gateway-factory"
import { createBrazilianBoardUseCase } from "./create-board-usecase-factory"
import { CreateMatchUseCase } from "../../../../domain/usecases/create-match-usecase"

export const createMatchUseCase = new CreateMatchUseCase([
    createBrazilianBoardUseCase
], uuidUniqueIdGateway, inMemoryMatchRepository, inMemoryUserRepository)