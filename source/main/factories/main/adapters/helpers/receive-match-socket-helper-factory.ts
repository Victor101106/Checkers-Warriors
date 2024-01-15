import { getUserByAccessTokenUseCase } from "../../../domain/usecases/get-user-by-access-token-usecase-factory"
import { createRelationUseCase } from "../../../domain/usecases/create-relation-usecase-factory"
import { getMatchUseCase } from "../../../domain/usecases/get-match-usecase-factory"
import { ReceiveMatchSocketHelper } from "../../../../adapters/helpers/receive-match-socket-helper"

export const receiveMatchSocketHelper = new ReceiveMatchSocketHelper(getUserByAccessTokenUseCase, createRelationUseCase, getMatchUseCase)