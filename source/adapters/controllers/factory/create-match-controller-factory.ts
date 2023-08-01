import { getUserByHttpCookieUseCase } from "../../../usecases/factory/get-user-by-http-cookie-usecase-factory"
import { createMatchUseCase } from "../../../usecases/factory/create-match-usecase-factory"
import { CreateMatchController } from "../create-match-controller"

export const createMatchController = new CreateMatchController(getUserByHttpCookieUseCase, createMatchUseCase)