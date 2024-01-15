import { RemainsAuthenticatedMiddleware } from "../../../../application/middlwares/remains-authenticated-middleware"
import { getUserByAccessTokenUseCase } from "../../domain/usecases/get-user-by-access-token-usecase-factory"

export const remainsAuthenticatedMiddleware = new RemainsAuthenticatedMiddleware(getUserByAccessTokenUseCase)