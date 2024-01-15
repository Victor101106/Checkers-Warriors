import { getUserByAccessTokenUseCase } from "../../domain/usecases/get-user-by-access-token-usecase-factory"
import { EnsureAuthenticatedMiddleware } from "../../../middleware/ensure-authenticated-middleware"

export const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware(getUserByAccessTokenUseCase)