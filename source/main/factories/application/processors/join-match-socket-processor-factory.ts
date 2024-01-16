import { inMemoryRelationRepository } from "../../infra/repositories/relation-repository-factory"
import { joinMatchUseCase } from "../../domain/usecases/join-match-usecase-factory"
import { JoinMatchSocketProcessor } from "../../../../application/processors/join-match-socket-processor"

export const joinMatchSocketProcessor = new JoinMatchSocketProcessor(inMemoryRelationRepository, joinMatchUseCase)