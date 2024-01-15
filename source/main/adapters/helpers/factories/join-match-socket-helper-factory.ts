import { inMemoryRelationRepository } from "../../../../external/repositories/factory/relation-repository-factory"
import { joinMatchUseCase } from "../../../../domain/usecases/factory/join-match-usecase-factory"
import { JoinMatchSocketHelper } from "../join-match-socket-helper"

export const joinMatchSocketHelper = new JoinMatchSocketHelper(inMemoryRelationRepository, joinMatchUseCase)