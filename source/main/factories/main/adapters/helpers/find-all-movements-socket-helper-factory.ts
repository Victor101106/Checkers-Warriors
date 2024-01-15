import { findAllMovementsOnMatchUseCase } from "../../../domain/usecases/find-all-movements-on-match-usecase-factory"
import { inMemoryRelationRepository } from "../../../infra/repositories/relation-repository-factory"
import { FindAllMovementsSocketHelper } from "../../../../adapters/helpers/find-all-movements-socket-helper"

export const findAllMovementsSocketHelper = new FindAllMovementsSocketHelper(findAllMovementsOnMatchUseCase, inMemoryRelationRepository)