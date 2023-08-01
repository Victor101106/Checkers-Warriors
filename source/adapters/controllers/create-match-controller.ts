import { GetUserByHttpCookieUseCase } from "../../usecases/get-user-by-http-cookie-usecase"
import { badRequest, created, unauthorized } from "./helpers/http-helper"
import { CreateMatchUseCase } from "../../usecases/create-match-usecase"
import { InvalidParameters } from "./errors/invalid-parameters"
import { HttpController } from "./ports/http-controller"
import { HttpResponse } from "./ports/http-response"
import { HttpRequest } from "./ports/http-request"
import { z } from 'zod'

export const CreateMatchControllerSchema = z.object({
    variation: z.string()
})

export class CreateMatchController implements HttpController {

    private readonly getUserByHttpCookieUseCase: GetUserByHttpCookieUseCase
    private readonly createMatchUseCase: CreateMatchUseCase

    constructor(getUserByHttpCookieUseCase: GetUserByHttpCookieUseCase, createMatchUseCase: CreateMatchUseCase) {
        this.getUserByHttpCookieUseCase = getUserByHttpCookieUseCase
        this.createMatchUseCase = createMatchUseCase
    }

    async handle(request: HttpRequest): Promise<HttpResponse> {

        const bodyOrError = CreateMatchControllerSchema.safeParse(request.body)

        if (!bodyOrError.success)
            return badRequest(new InvalidParameters())
        
        const { variation } = bodyOrError.data

        const userOrError = await this.getUserByHttpCookieUseCase.execute(request)

        if (userOrError.isLeft())
            return unauthorized(userOrError.value)

        const userId = userOrError.value.id.value

        const matchOrError = await this.createMatchUseCase.execute({ variation, userId })

        if (matchOrError.isLeft())
            return badRequest(matchOrError.value)
        
        const matchId = matchOrError.value.id.value

        return created({ id: matchId })

    }

}