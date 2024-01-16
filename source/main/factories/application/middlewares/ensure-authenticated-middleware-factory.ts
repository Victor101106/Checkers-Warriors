import { EnsureAuthenticatedMiddleware } from "../../../../application/middlewares/ensure-authenticated-middleware"
import { getUserByAccessTokenUseCase } from "../../domain/usecases/get-user-by-access-token-usecase-factory"

export const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware(getUserByAccessTokenUseCase)