import { AuthenticateUserUseCase } from "../../domain/usecases/authenticate-user-usecase"
import { badRequest, ok, unauthorized } from "../helpers/http-helper"
import { InvalidParameters } from "../errors/invalid-parameters"
import { serializeCookie } from "../helpers/cookie-helper"
import { HttpHandler } from "../contracts/http-handler"
import { HttpResponse } from "../contracts/http-response"
import { HttpRequest } from "../contracts/http-request"
import { z } from 'zod'

export const AuthenticateUserControllerSchema = z.object({
    password: z.string(),
    email: z.string()
})

export class AuthenticateUserController implements HttpHandler {

    private readonly authenticateUserUseCase: AuthenticateUserUseCase

    constructor(authenticateUserUseCase: AuthenticateUserUseCase) {
        this.authenticateUserUseCase = authenticateUserUseCase
    }

    async handle(request: HttpRequest): Promise<HttpResponse> {

        const bodyOrError = AuthenticateUserControllerSchema.safeParse(request.body)

        if (!bodyOrError.success)
            return badRequest(new InvalidParameters())

        const { password, email } = bodyOrError.data

        const accessTokenOrError = await this.authenticateUserUseCase.execute({ password, email })

        if (accessTokenOrError.isLeft())
            return unauthorized(accessTokenOrError.value)

        const accessToken = accessTokenOrError.value
        const year2038Problem = 2147483647000

        const cookieHeader =  {
            value: serializeCookie('access-token', accessToken, { httpOnly: true, sameSite: true,  expires: new Date(year2038Problem) }),
            name: 'Set-Cookie'
        }

        return ok({ auth: true }, [ cookieHeader ])

    }

}