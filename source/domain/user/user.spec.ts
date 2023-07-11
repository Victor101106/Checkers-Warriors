import { describe, expect, it } from "vitest"
import { Right } from "../../shared/either"
import { User } from "./user"

describe('User domain', () => {

    it('should be able to create a valid user', () => {

        const object = User.create({
            password: { value: 'Password123.' },
            email: 'prompt@email.com',
            name: 'Name'
        })

        expect(object).instanceOf(Right)

        if (object.isRight()) {
            expect(object.value).instanceOf(User)
        }

    })

})