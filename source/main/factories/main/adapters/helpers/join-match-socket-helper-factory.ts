import { inMemoryRelationRepository } from "../../../infra/repositories/relation-repository-factory"
import { joinMatchUseCase } from "../../../domain/usecases/join-match-usecase-factory"
import { JoinMatchSocketHelper } from "../../../../adapters/helpers/join-match-socket-helper"

export const joinMatchSocketHelper = new JoinMatchSocketHelper(inMemoryRelationRepository, joinMatchUseCase)