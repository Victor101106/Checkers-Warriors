import { findAllMovementsOnMatchUseCase } from "../../domain/usecases/find-all-movements-on-match-usecase-factory"
import { inMemoryRelationRepository } from "../../infra/repositories/relation-repository-factory"
import { FindAllMovementsSocketProcessor } from "../../../../application/processors/find-all-movements-socket-processor"

export const findAllMovementsSocketProcessor = new FindAllMovementsSocketProcessor(findAllMovementsOnMatchUseCase, inMemoryRelationRepository)