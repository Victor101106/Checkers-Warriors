import { BcryptPasswordGateway } from "./bcrypt-password-gateway"
import { describe, expect, it } from "vitest"

describe('Bcrypt password gateway', () => {

    const bcryptPasswordGateway = new BcryptPasswordGateway()
    const password = 'Password123.'

    let encryptedPassword: string 

    it('should be able to encrypt a password', async () => {

        encryptedPassword = await bcryptPasswordGateway.encrypt(password)

        expect(encryptedPassword.trim().length).toBeGreaterThan(0)
        expect(encryptedPassword).not.toBe(password)

    })

    it('should be able to compare a encrypted password with a password', async () => {

        const incorrectComparation = await bcryptPasswordGateway.compare('Password456.', encryptedPassword)
        const correctComparation = await bcryptPasswordGateway.compare(password, encryptedPassword)

        expect(incorrectComparation).toBeFalsy()
        expect(correctComparation).toBeTruthy()

    })

})