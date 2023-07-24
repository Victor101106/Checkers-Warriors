import { GetUserByAccessTokenUseCase } from "../../usecases/get-user-by-access-token-usecase"
import { badRequest, created, unauthorized } from "./helpers/http-helper"
import { CreateMatchUseCase } from "../../usecases/create-match-usecase"
import { InvalidParameters } from "./errors/invalid-parameters"
import { HttpController } from "./ports/http-controller"
import { parseCookies } from "./helpers/cookie-helper"
import { HttpResponse } from "./ports/http-response"
import { HttpRequest } from "./ports/http-request"
import { z } from 'zod'

export const CreateMatchControllerSchema = z.object({
    variation: z.string()
})

export class CreateMatchController implements HttpController {

    private readonly getUserByAccessTokenUseCase: GetUserByAccessTokenUseCase
    private readonly createMatchUseCase: CreateMatchUseCase

    constructor(getUserByAccessTokenUseCase: GetUserByAccessTokenUseCase, createMatchUseCase: CreateMatchUseCase) {
        this.getUserByAccessTokenUseCase = getUserByAccessTokenUseCase
        this.createMatchUseCase = createMatchUseCase
    }

    async handle(request: HttpRequest): Promise<HttpResponse> {

        const bodyOrError = CreateMatchControllerSchema.safeParse(request.body)

        if (!bodyOrError.success)
            return badRequest(new InvalidParameters())
        
        const { variation } = bodyOrError.data

        const cookies = parseCookies(String(request.headers.cookie))
        const accessToken = cookies['access-token']
        
        const userOrError = await this.getUserByAccessTokenUseCase.execute({ accessToken })

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