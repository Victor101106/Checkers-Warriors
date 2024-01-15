import { findAllMovementsOnMatchUseCase } from "../../../../domain/usecases/factory/find-all-movements-on-match-usecase-factory"
import { inMemoryRelationRepository } from "../../../../infra/repositories/factory/relation-repository-factory"
import { FindAllMovementsSocketHelper } from "../find-all-movements-socket-helper"

export const findAllMovementsSocketHelper = new FindAllMovementsSocketHelper(findAllMovementsOnMatchUseCase, inMemoryRelationRepository)