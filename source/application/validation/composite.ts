import { Either, left, right } from "../../shared/either"
import { Validator } from "./validator"

export class ValidationComposite implements Validator {

    private readonly validators: Validator[]

    constructor(validators: Validator[]) {
        this.validators = validators
    }

    validate(): Either<Error, void> {
        
        for (let validator of this.validators) {

            const validationResponse = validator.validate()

            if (validationResponse.isLeft()) {
                return left(validationResponse.value)
            }

        }

        return right(undefined)

    }

}