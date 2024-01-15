import { InvalidPassword } from "./errors/invalid-password"
import { Left, Right } from "../../../shared/either"
import { describe, it, expect } from "vitest"
import { Password } from "./password"

describe('Password domain', () => {

    it('should be able to create a valid password', () => {

        const object = Password.create('Password123.')

        expect(object).instanceOf(Right)

        if (object.isRight()) {
            expect(object.value).instanceOf(Password)
            expect(object.value.value).toBe('Password123.')
        }

    })

    it('should be able to create a password without validation', () => {

        const object = Password.create('771e0f2a-8cd2-4a97-a153-a4821fcd00b6', false)

        expect(object).instanceOf(Right)

        if (object.isRight()) {
            expect(object.value).instanceOf(Password)
            expect(object.value.value).toBe('771e0f2a-8cd2-4a97-a153-a4821fcd00b6')
        }

    })

    it('should not be able to create a password without numbers', () => {

        const object = Password.create('Password.')

        expect(object).instanceOf(Left)

        if (object.isLeft()) {
            expect(object.value).instanceOf(InvalidPassword)
        }

    })

    it('should not be able to create a password without symbols', () => {

        const object = Password.create('Password123')

        expect(object).instanceOf(Left)

        if (object.isLeft()) {
            expect(object.value).instanceOf(InvalidPassword)
        }

    })

    it('should not be able to create a password without capital letters', () => {

        const object = Password.create('password123.')

        expect(object).instanceOf(Left)

        if (object.isLeft()) {
            expect(object.value).instanceOf(InvalidPassword)
        }

    })

})