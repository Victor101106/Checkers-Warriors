import { getUserByHttpCookieUseCase } from "../../../../usecases/factory/get-user-by-http-cookie-usecase-factory"
import { createRelationUseCase } from "../../../../usecases/factory/create-relation-usecase-factory"
import { getMatchUseCase } from "../../../../usecases/factory/get-match-usecase-factory"
import { ReceiveMatchSocketHelper } from "../receive-match-socket-helper"

export const receiveMatchSocketHelper = new ReceiveMatchSocketHelper(getUserByHttpCookieUseCase, createRelationUseCase, getMatchUseCase)