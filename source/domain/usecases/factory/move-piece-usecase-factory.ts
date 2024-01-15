import { MoveBrazilianPieceUseCase } from "../adapters/move-piece/move-brazilian-piece-usecase"
import { findAllBrazilianMovementsUseCase } from "./find-all-movements-usecase-factory"

export const moveBrazilianPieceUseCase = new MoveBrazilianPieceUseCase(findAllBrazilianMovementsUseCase)