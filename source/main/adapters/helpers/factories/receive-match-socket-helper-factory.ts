import { getUserByAccessTokenUseCase } from "../../../../domain/usecases/factory/get-user-by-access-token-usecase-factory"
import { createRelationUseCase } from "../../../../domain/usecases/factory/create-relation-usecase-factory"
import { getMatchUseCase } from "../../../../domain/usecases/factory/get-match-usecase-factory"
import { ReceiveMatchSocketHelper } from "../receive-match-socket-helper"

export const receiveMatchSocketHelper = new ReceiveMatchSocketHelper(getUserByAccessTokenUseCase, createRelationUseCase, getMatchUseCase)