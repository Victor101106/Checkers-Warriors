import { inMemoryRelationRepository } from "../../../../external/repositories/factory/relation-repository-factory"
import { movePieceOnMatchUseCase } from "../../../../usecases/factory/move-piece-on-match-usecase-factory"
import { MovePieceSocketHelper } from "../move-piece-socket-helper"

export const movePieceSocketHelper = new MovePieceSocketHelper(movePieceOnMatchUseCase, inMemoryRelationRepository)