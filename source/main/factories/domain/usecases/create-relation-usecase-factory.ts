import { inMemoryRelationRepository } from "../../infra/repositories/relation-repository-factory"
import { inMemoryMatchRepository } from "../../infra/repositories/match-repository-factory"
import { CreateRelationUseCase } from "../../../../domain/usecases/create-relation-usecase"

export const createRelationUseCase = new CreateRelationUseCase(inMemoryRelationRepository, inMemoryMatchRepository)