import { getUserByAccessTokenUseCase } from "../../domain/usecases/get-user-by-access-token-usecase-factory"
import { RemainsAuthenticatedMiddleware } from "../../../middleware/remains-authenticated-middleware"

export const remainsAuthenticatedMiddleware = new RemainsAuthenticatedMiddleware(getUserByAccessTokenUseCase)