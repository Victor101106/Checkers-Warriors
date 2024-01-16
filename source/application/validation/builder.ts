import { NumberValidator, ObjectValidator, PositionValidator, StringValidator } from "./types"
import { Required, RequiredString } from "./required"
import { Validator } from "./validator"

export class ValidationBuilder {

    private readonly validators: Validator[] = []
    private readonly field: string
    private readonly value: any

    private constructor(field: string, value: any) {
        this.field = field
        this.value = value
    }

    static of(field: string, value: any): ValidationBuilder {
        return new ValidationBuilder(field, value)
    }

    required(): ValidationBuilder {

        if (typeof this.value === 'string') {
            this.validators.push(new RequiredString(this.field, this.value))
        } else {
            this.validators.push(new Required(this.field, this.value))
        }

        return this

    }

    string(): ValidationBuilder {
        this.validators.push(new StringValidator(this.field, this.value))
        return this
    }

    number(): ValidationBuilder {
        this.validators.push(new NumberValidator(this.field, this.value))
        return this
    }

    object(): ValidationBuilder {
        this.validators.push(new ObjectValidator(this.field, this.value))
        return this
    }

    position(): ValidationBuilder {
        this.validators.push(new PositionValidator(this.field, this.value))
        return this
    }

    build(): Validator[] {
        return this.validators
    }

}