import { InvalidRange } from "./errors/invalid-range"
import { Left, Right } from "../../shared/either"
import { describe, expect, it } from "vitest"
import { Range } from "./range"

describe('Range domain', () => {

    it('should be able to create a valid range', () => {

        const object = Range.create(Infinity)

        expect(object).instanceOf(Right)

        if (object.isRight()) {
            expect(object.value).instanceOf(Range)
            expect(object.value.value).toBe(Infinity)
        }

    })

    it('should not be able to create a range less than 0', () => {

        const object = Range.create(-Infinity)

        expect(object).instanceOf(Left)

        if (object.isLeft()) {
            expect(object.value).instanceOf(InvalidRange)
        }

    })

})