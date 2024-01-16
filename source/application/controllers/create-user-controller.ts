import { AuthenticateUserUseCase } from "../../domain/usecases/authenticate-user-usecase"
import { CreateUserUseCase } from "../../domain/usecases/create-user-usecase"
import { badRequest, created, unauthorized } from "../helpers/http-helper"
import { serializeCookie } from "../helpers/cookie-helper"
import { HttpResponse } from "../contracts/http-response"
import { ValidationBuilder } from "../validation/builder"
import { HttpHandler } from "../contracts/http-handler"
import { HttpRequest } from "../contracts/http-request"
import { Validator } from "../validation/validator"

export class CreateUserController extends HttpHandler {

    private readonly authenticateUserUseCase: AuthenticateUserUseCase
    private readonly createUserUseCase: CreateUserUseCase

    constructor(authenticateUserUseCase: AuthenticateUserUseCase, createUserUseCase: CreateUserUseCase) {
        super()
        this.authenticateUserUseCase = authenticateUserUseCase
        this.createUserUseCase = createUserUseCase
    }

    protected buildValidators(httpRequest: HttpRequest): Validator[] {
        return [
            ...ValidationBuilder.of('body', httpRequest.body).required().object().build(),
            ...ValidationBuilder.of('password', httpRequest.body.password).required().string().build(),
            ...ValidationBuilder.of('email', httpRequest.body.email).required().string().build(),
            ...ValidationBuilder.of('name', httpRequest.body.name).required().string().build(),
        ]
    }

    async perform(request: HttpRequest): Promise<HttpResponse> {
        
        const body = request.body

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