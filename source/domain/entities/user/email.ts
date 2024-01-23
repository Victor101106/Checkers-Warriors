import { Either, left, right } from "../../../@shared/either"
import { InvalidEmail } from "./errors/invalid-email"

export class Email {

    public readonly value: string

    private constructor(value: string) {
        this.value = value
        Object.freeze(this)
    }

    static create(email: string): Either<InvalidEmail, Email> {

        const isInvalidEmail = !this.validateEmail(email)

        if (isInvalidEmail) 
            return left(new InvalidEmail())

        return right(new Email(email))

    }

    static validateEmail(email: string): boolean {
        const expression = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        return expression.test(email)
    }

}