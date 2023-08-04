import { AuthenticateUserUseCase } from "../../usecases/authenticate-user-usecase"
import { CreateUserUseCase } from "../../usecases/create-user-usecase"
import { InvalidParameters } from "./errors/invalid-parameters"
import { badRequest, created, unauthorized } from "./helpers/http-helper"
import { HttpController } from "./ports/http-controller"
import { HttpResponse } from "./ports/http-response"
import { HttpRequest } from "./ports/http-request"
import { z } from 'zod'
import { serializeCookie } from "./helpers/cookie-helper"

export const CreateUserControllerSchema = z.object({
    password: z.string(),
    email: z.string(),
    name: z.string()
})

export class CreateUserController implements HttpController {

    private readonly authenticateUserUseCase: AuthenticateUserUseCase
    private readonly createUserUseCase: CreateUserUseCase

    constructor(authenticateUserUseCase: AuthenticateUserUseCase, createUserUseCase: CreateUserUseCase) {
        this.authenticateUserUseCase = authenticateUserUseCase
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
    
        const accessTokenOrError = await this.authenticateUserUseCase.execute({ 
            password: body.password,
            email: body.email
        })

        if (accessTokenOrError.isLeft())
            return unauthorized(accessTokenOrError.value)

        const accessToken = accessTokenOrError.value
        const year2038Problem = 2147483647000

        const cookieHeader =  {
            name: 'Set-Cookie',
            value: serializeCookie('access-token', accessToken, { httpOnly: true, sameSite: true, expires: new Date(year2038Problem) })
        }

        return created({ auth: true }, [ cookieHeader ])

    }

}