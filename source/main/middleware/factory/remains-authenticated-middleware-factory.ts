import { getUserByAccessTokenUseCase } from "../../../domain/usecases/factory/get-user-by-access-token-usecase-factory"
import { RemainsAuthenticatedMiddleware } from "../remains-authenticated-middleware"

export const remainsAuthenticatedMiddleware = new RemainsAuthenticatedMiddleware(getUserByAccessTokenUseCase)