import { inMemoryRelationRepository } from "../../../infra/repositories/relation-repository-factory"
import { giveUpUseCase } from "../../../domain/usecases/give-up-usecase-factory"
import { GiveUpSocketHelper } from "../../../../events/helpers/give-up-event-helper"

export const giveUpSocketHelper = new GiveUpSocketHelper(inMemoryRelationRepository, giveUpUseCase)