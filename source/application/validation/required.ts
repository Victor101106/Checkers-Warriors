import { RequiredFieldError } from "../errors/required-field-error"
import { Either, left, right } from "../../@shared/either"
import { Validator } from "./validator"

export class Required implements Validator {

    public readonly field: string
    public readonly value: any

    constructor(field: string, value: any) {
        this.field = field
        this.value = value
    }

    validate(): Either<Error, void> {

        if (this.value === null || this.value === undefined) {
            return left(new RequiredFieldError(this.field))
        }

        return right(undefined)
        
    }

}

export class RequiredString extends Required {

    public override readonly field: string
    public override readonly value: string

    constructor(field: string, value: string) {
        super(field, value)
        this.field = field
        this.value = value
    }

    override validate(): Either<Error, void> {

        if (super.validate().isLeft() || this.value === '') {
            return left(new RequiredFieldError(this.field))
        }

        return right(undefined)
        
    }

}