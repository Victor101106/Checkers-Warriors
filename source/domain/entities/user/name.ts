import { Either, left, right } from "../../../shared/either"
import { InvalidName } from "./errors/invalid-name"

export class Name {

    public readonly value: string

    private constructor(value: string) {
        this.value = value
        Object.freeze(this)
    }

    static create(name: string): Either<InvalidName, Name> {

        const isInvalidName = !this.validateName(name)

        if (isInvalidName)
            return left(new InvalidName)

        return right(new Name(name))
        
    }

    static validateName(name: string): boolean {
        return name.trim() === name && name.length > 2
    }

}