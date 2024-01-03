import { getUserByAccessTokenUseCase } from "../../../../usecases/factory/get-user-by-access-token-usecase-factory"
import { createRelationUseCase } from "../../../../usecases/factory/create-relation-usecase-factory"
import { getMatchUseCase } from "../../../../usecases/factory/get-match-usecase-factory"
import { ReceiveMatchSocketHelper } from "../receive-match-socket-helper"

export const receiveMatchSocketHelper = new ReceiveMatchSocketHelper(getUserByAccessTokenUseCase, createRelationUseCase, getMatchUseCase)