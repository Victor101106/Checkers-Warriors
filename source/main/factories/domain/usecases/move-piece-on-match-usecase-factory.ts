import { inMemoryMatchRepository } from "../../infra/repositories/match-repository-factory"
import { moveBrazilianPieceUseCase } from "./move-piece-usecase-factory"
import { MovePieceOnMatchUseCase } from "../../../../domain/usecases/move-piece-on-match-usecase"

export const movePieceOnMatchUseCase = new MovePieceOnMatchUseCase([
    moveBrazilianPieceUseCase
], inMemoryMatchRepository)