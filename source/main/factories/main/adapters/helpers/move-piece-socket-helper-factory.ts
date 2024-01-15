import { inMemoryRelationRepository } from "../../../infra/repositories/relation-repository-factory"
import { movePieceOnMatchUseCase } from "../../../domain/usecases/move-piece-on-match-usecase-factory"
import { MovePieceSocketHelper } from "../../../../adapters/helpers/move-piece-socket-helper"

export const movePieceSocketHelper = new MovePieceSocketHelper(movePieceOnMatchUseCase, inMemoryRelationRepository)