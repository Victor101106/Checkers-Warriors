import { findAllMovementsOnMatchUseCase } from "../../../domain/usecases/find-all-movements-on-match-usecase-factory"
import { inMemoryRelationRepository } from "../../../infra/repositories/relation-repository-factory"
import { FindAllMovementsSocketHelper } from "../../../../events/helpers/find-all-movements-event-helper"

export const findAllMovementsSocketHelper = new FindAllMovementsSocketHelper(findAllMovementsOnMatchUseCase, inMemoryRelationRepository)