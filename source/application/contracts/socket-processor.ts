import { ValidationComposite } from "../validation/composite"
import { Validator } from "../validation/validator"
import { Either, left } from "../../shared/either"

export abstract class SocketProcessor {

    abstract perform(data: any): Promise<Either<Error, any>>

    async execute(data: any): Promise<Either<Error, any>> {

        const validationResponse = this.validate(data)

        if (validationResponse.isLeft())
            return left(validationResponse.value)
    
        return await this.perform(data)

    }

    protected buildValidators(data: any): Validator[] {
        return new Array()
    }

    private validate(data: any): Either<Error, void> {
        const validators = this.buildValidators(data)
        return new ValidationComposite(validators).validate()
    }

}