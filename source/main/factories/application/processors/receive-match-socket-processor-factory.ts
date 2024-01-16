import { getUserByAccessTokenUseCase } from "../../domain/usecases/get-user-by-access-token-usecase-factory"
import { createRelationUseCase } from "../../domain/usecases/create-relation-usecase-factory"
import { getMatchUseCase } from "../../domain/usecases/get-match-usecase-factory"
import { ReceiveMatchSocketProcessor } from "../../../../application/processors/receive-match-socket-processor"

export const receiveMatchSocketProcessor = new ReceiveMatchSocketProcessor(getUserByAccessTokenUseCase, createRelationUseCase, getMatchUseCase)