import { inMemoryRelationRepository } from "../../../infra/repositories/relation-repository-factory"
import { giveUpUseCase } from "../../../domain/usecases/give-up-usecase-factory"
import { GiveUpSocketHelper } from "../../../../adapters/helpers/give-up-socket-helper"

export const giveUpSocketHelper = new GiveUpSocketHelper(inMemoryRelationRepository, giveUpUseCase)