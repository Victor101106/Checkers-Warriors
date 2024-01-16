import { inMemoryRelationRepository } from "../../infra/repositories/relation-repository-factory"
import { movePieceOnMatchUseCase } from "../../domain/usecases/move-piece-on-match-usecase-factory"
import { MovePieceSocketProcessor } from "../../../../application/processors/move-piece-socket-processor"

export const movePieceSocketProcessor = new MovePieceSocketProcessor(movePieceOnMatchUseCase, inMemoryRelationRepository)