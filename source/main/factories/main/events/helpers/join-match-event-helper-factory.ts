import { inMemoryRelationRepository } from "../../../infra/repositories/relation-repository-factory"
import { joinMatchUseCase } from "../../../domain/usecases/join-match-usecase-factory"
import { JoinMatchSocketHelper } from "../../../../events/helpers/join-match-event-helper"

export const joinMatchSocketHelper = new JoinMatchSocketHelper(inMemoryRelationRepository, joinMatchUseCase)