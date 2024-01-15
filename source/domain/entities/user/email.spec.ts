import { InvalidEmail } from "./errors/invalid-email"
import { Left, Right } from "../../../shared/either"
import { describe, expect, it } from "vitest"
import { Email } from "./email"

describe('Email domain', () => {

    it('should be able to create a valid email', () => {

        const object = Email.create('prompt@mail.com')

        expect(object).instanceOf(Right)

        if (object.isRight()) {
            expect(object.value).instanceOf(Email)
            expect(object.value.value).toBe('prompt@mail.com')
        }

    })

    it('should not be able to create a invalid email', () => {

        const object = Email.create('prompt@mail')

        expect(object).instanceOf(Left)

        if (object.isLeft()) {
            expect(object.value).instanceOf(InvalidEmail)
        }

    })

})