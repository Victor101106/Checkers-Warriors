import { inMemoryRelationRepository } from "../../../../external/repositories/factory/relation-repository-factory"
import { giveUpUseCase } from "../../../../usecases/factory/give-up-usecase-factory"
import { GiveUpSocketHelper } from "../give-up-socket-helper"

export const giveUpSocketHelper = new GiveUpSocketHelper(inMemoryRelationRepository, giveUpUseCase)