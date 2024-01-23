import { ValidationComposite } from "../validation/composite"
import { badRequest } from "../helpers/http-helper"
import { Validator } from "../validation/validator"
import { HttpResponse } from "./http-response"
import { HttpRequest } from "./http-request"
import { Either } from "../../@shared/either"

export abstract class HttpHandler {

    abstract perform(httpRequest: HttpRequest): Promise<HttpResponse>

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

        const validationResponse = this.validate(httpRequest)

        if (validationResponse.isLeft())
            return badRequest(validationResponse.value)
    
        return await this.perform(httpRequest)

    }

    protected buildValidators(httpRequest: HttpRequest): Validator[] {
        return new Array()
    }

    private validate(httpRequest: HttpRequest): Either<Error, void> {
        const validators = this.buildValidators(httpRequest)
        return new ValidationComposite(validators).validate()
    }

}