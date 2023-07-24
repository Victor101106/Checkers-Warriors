import { findAllMovementsUseCase } from "./find-all-movements-usecase-factory"
import { MoveBrazilianPieceUseCase } from "../adapters/move-piece/move-brazilian-piece-usecase"

export const moveBrazilianPieceUseCase = new MoveBrazilianPieceUseCase(findAllMovementsUseCase)