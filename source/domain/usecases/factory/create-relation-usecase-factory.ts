import { inMemoryRelationRepository } from "../../../infra/repositories/factory/relation-repository-factory"
import { inMemoryMatchRepository } from "../../../infra/repositories/factory/match-repository-factory"
import { CreateRelationUseCase } from "../create-relation-usecase"

export const createRelationUseCase = new CreateRelationUseCase(inMemoryRelationRepository, inMemoryMatchRepository)