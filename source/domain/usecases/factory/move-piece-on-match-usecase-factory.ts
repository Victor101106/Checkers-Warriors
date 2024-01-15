import { inMemoryMatchRepository } from "../../../external/repositories/factory/match-repository-factory"
import { moveBrazilianPieceUseCase } from "./move-piece-usecase-factory"
import { MovePieceOnMatchUseCase } from "../move-piece-on-match-usecase"

export const movePieceOnMatchUseCase = new MovePieceOnMatchUseCase([
    moveBrazilianPieceUseCase
], inMemoryMatchRepository)