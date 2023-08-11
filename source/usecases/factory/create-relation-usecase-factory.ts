import { inMemoryRelationRepository } from "../../external/repositories/factory/relation-repository-factory"
import { inMemoryMatchRepository } from "../../external/repositories/factory/match-repository-factory"
import { CreateRelationUseCase } from "../create-relation-usecase"

export const createRelationUseCase = new CreateRelationUseCase(inMemoryRelationRepository, inMemoryMatchRepository)