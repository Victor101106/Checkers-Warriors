import { findAllPlayerCorrectMovementsByQuantityRuleUseCase } from "./find-all-player-correct-movements-usecase-factory"
import { MoveBrazilianPieceUseCase } from "../adapters/move-piece/move-brazilian-piece-usecase"

export const moveBrazilianPieceUseCase = new MoveBrazilianPieceUseCase(findAllPlayerCorrectMovementsByQuantityRuleUseCase)