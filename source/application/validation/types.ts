import { FieldTypeError } from "../errors/field-type-error"
import { Either, left, right } from "../../shared/either"
import { Validator } from "./validator"

export class StringValidator implements Validator {

    public readonly field: string
    public readonly value: any

    constructor(field: string, value: any) {
        this.field = field
        this.value = value
    }

    validate(): Either<Error, void> {

        if (typeof this.value !== 'string') {
            return left(new FieldTypeError(this.field))
        }

        return right(undefined)
        
    }

}

export class NumberValidator implements Validator {

    public readonly field: string
    public readonly value: any

    constructor(field: string, value: any) {
        this.field = field
        this.value = value
    }

    validate(): Either<Error, void> {

        if (typeof this.value !== 'number') {
            return left(new FieldTypeError(this.field))
        }

        return right(undefined)
        
    }

}

export class ObjectValidator implements Validator {

    public readonly field: string
    public readonly value: any

    constructor(field: string, value: any) {
        this.field = field
        this.value = value
    }

    validate(): Either<Error, void> {

        if (typeof this.value !== 'object') {
            return left(new FieldTypeError(this.field))
        }

        return right(undefined)
        
    }

}

export class PositionValidator extends ObjectValidator {

    constructor(field: string, value: any) {
        super(field, value)
    }

    validate(): Either<Error, void> {

        if (super.validate().isLeft() || typeof this.value.column !== 'number' || typeof this.value.row !== 'number') {
            return left(new FieldTypeError(this.field))
        }

        return right(undefined)
        
    }

}