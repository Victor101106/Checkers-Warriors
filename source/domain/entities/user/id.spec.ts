import { Left, Right } from "../../../shared/either"
import { InvalidId } from "./errors/invalid-id"
import { describe, expect, it } from "vitest"
import { Id } from "./id"

describe('Id domain', () => {

    it('should be able to create a valid id', () => {

        const object = Id.create('1823dccf-c295-454c-8260-384a6396c151')

        expect(object).instanceOf(Right)

        if (object.isRight()) {
            expect(object.value).instanceOf(Id)
            expect(object.value.value).toBe('1823dccf-c295-454c-8260-384a6396c151')
        }

    })

    it('should be able to create a id without input', () => {

        const object = Id.create(undefined)

        expect(object).instanceOf(Right)

        if (object.isRight()) {
            expect(object.value).instanceOf(Id)
            expect(object.value.value.length).toBe(36)
        }

    })

    it('should not be able to create a id with empty content', () => {

        const object = Id.create('')

        expect(object).instanceOf(Left)

        if (object.isLeft()) {
            expect(object.value).instanceOf(InvalidId)
        }

    })

})