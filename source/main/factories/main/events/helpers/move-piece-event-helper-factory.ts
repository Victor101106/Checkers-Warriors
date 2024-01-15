import { inMemoryRelationRepository } from "../../../infra/repositories/relation-repository-factory"
import { movePieceOnMatchUseCase } from "../../../domain/usecases/move-piece-on-match-usecase-factory"
import { MovePieceSocketHelper } from "../../../../events/helpers/move-piece-event-helper"

export const movePieceSocketHelper = new MovePieceSocketHelper(movePieceOnMatchUseCase, inMemoryRelationRepository)