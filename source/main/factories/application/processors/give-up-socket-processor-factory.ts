import { inMemoryRelationRepository } from "../../infra/repositories/relation-repository-factory"
import { giveUpUseCase } from "../../domain/usecases/give-up-usecase-factory"
import { GiveUpSocketProcessor } from "../../../../application/processors/give-up-socket-processor"

export const giveUpSocketProcessor = new GiveUpSocketProcessor(inMemoryRelationRepository, giveUpUseCase)