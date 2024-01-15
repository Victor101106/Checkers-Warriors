import { CreateMatchUseCase } from "../../domain/usecases/create-match-usecase"
import { InvalidParameters } from "../errors/invalid-parameters"
import { badRequest, created } from "../helpers/http-helper"
import { HttpHandler } from "../contracts/http-handler"
import { HttpResponse } from "../contracts/http-response"
import { HttpRequest } from "../contracts/http-request"
import { z } from 'zod'

export const CreateMatchControllerSchema = z.object({
    variation: z.string(),
    userId: z.string()
})

export class CreateMatchController implements HttpHandler {

    private readonly createMatchUseCase: CreateMatchUseCase

    constructor(createMatchUseCase: CreateMatchUseCase) {
        this.createMatchUseCase = createMatchUseCase
    }

    async handle(request: HttpRequest): Promise<HttpResponse> {

        const bodyOrError = CreateMatchControllerSchema.safeParse(request.body)

        if (!bodyOrError.success)
            return badRequest(new InvalidParameters())
        
        const { variation, userId } = bodyOrError.data

        const matchOrError = await this.createMatchUseCase.execute({ variation, userId })

        if (matchOrError.isLeft())
            return badRequest(matchOrError.value)
        
        const matchId = matchOrError.value.id.value

        return created({ id: matchId })

    }

}