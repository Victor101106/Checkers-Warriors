import { InvalidPassword } from "./errors/invalid-password"
import { Either, left, right } from "../../../@shared/either"

export class Password {

    public readonly value: string

    private constructor(value: string) {
        this.value = value
        Object.freeze(this)
    }

    static create(password: string, validate: boolean = true): Either<InvalidPassword, Password> {

        const isInvalidPassword = validate && !this.validatePassword(password)

        if (isInvalidPassword) 
            return left(new InvalidPassword())
        
        return right(new Password(password))
        
    }

    static validatePassword(password: string): boolean {
        const expression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/
        return expression.test(password)
    }

}