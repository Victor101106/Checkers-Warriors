import { getUserByAccessTokenUseCase } from "../../../domain/usecases/factory/get-user-by-access-token-usecase-factory"
import { EnsureAuthenticatedMiddleware } from "../ensure-authenticated-middleware"

export const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware(getUserByAccessTokenUseCase)