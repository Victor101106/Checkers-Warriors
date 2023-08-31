import { findAllMovementsOnMatchUseCase } from "../../../../usecases/factory/find-all-movements-on-match-usecase-factory"
import { inMemoryRelationRepository } from "../../../../external/repositories/factory/relation-repository-factory"
import { FindAllMovementsSocketHelper } from "../find-all-movements-socket-helper"

export const findAllMovementsSocketHelper = new FindAllMovementsSocketHelper(findAllMovementsOnMatchUseCase, inMemoryRelationRepository)