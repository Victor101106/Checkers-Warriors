import { CreateUserUseCase } from "../../usecases/create-user-usecase"
import { InvalidParameters } from "./errors/invalid-parameters"
import { badRequest, created } from "./helpers/http-helper"
import { HttpController } from "./ports/http-controller"
import { HttpResponse } from "./ports/http-response"
import { HttpRequest } from "./ports/http-request"
import { z } from 'zod'

export const CreateUserControllerSchema = z.object({
    password: z.string(),
    email: z.string(),
    name: z.string()
})

export class CreateUserController implements HttpController {

    private readonly createUserUseCase: CreateUserUseCase

    constructor(createUserUseCase: CreateUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }

    async handle(request: HttpRequest): Promise<HttpResponse> {

        const bodyOrError = CreateUserControllerSchema.safeParse(request.body)

        if (!bodyOrError.success)
            return badRequest(new InvalidParameters())
        
        const body = bodyOrError.data

        const userOrError = await this.createUserUseCase.execute({
            password: body.password,
            email: body.email,
            name: body.name
        })

        if (userOrError.isLeft())
            return badRequest(userOrError.value)

        return created(undefined)

    }

}