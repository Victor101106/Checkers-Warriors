import { CreateMatchUseCase } from "../../domain/usecases/create-match-usecase"
import { badRequest, created } from "../helpers/http-helper"
import { ValidationBuilder } from "../validation/builder"
import { HttpResponse } from "../contracts/http-response"
import { HttpHandler } from "../contracts/http-handler"
import { HttpRequest } from "../contracts/http-request"
import { Validator } from "../validation/validator"

export class CreateMatchController extends HttpHandler {

    private readonly createMatchUseCase: CreateMatchUseCase

    constructor(createMatchUseCase: CreateMatchUseCase) {
        super()
        this.createMatchUseCase = createMatchUseCase
    }

    protected buildValidators(httpRequest: HttpRequest): Validator[] {
        return [
            ...ValidationBuilder.of('body', httpRequest.body).required().object().build(),
            ...ValidationBuilder.of('variation', httpRequest.body.variation).required().string().build(),
            ...ValidationBuilder.of('userId', httpRequest.body.variation).required().string().build(),
        ]
    }

    async perform(request: HttpRequest): Promise<HttpResponse> {
        
        const { variation, userId } = request.body

        const matchOrError = await this.createMatchUseCase.execute({ variation, userId })

        if (matchOrError.isLeft())
            return badRequest(matchOrError.value)
        
        const matchId = matchOrError.value.id.value

        return created({ id: matchId })

    }

}