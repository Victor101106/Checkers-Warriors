import { Either, left, right } from "../../../shared/either"
import { InvalidRange } from "./errors/invalid-range"

export class Range {

    public readonly value: number

    private constructor(value: number) {
        this.value = value
        Object.freeze(this)
    }

    static create(range: number): Either<InvalidRange, Range> {

        const isInvalidRange = !this.validateRange(range)

        if (isInvalidRange)
            return left(new InvalidRange)

        return right(new Range(range))

    }

    static validateRange(range: number): boolean {
        return range >= 0
    }

}