import { BcryptPasswordService } from "./bcrypt-password-service"
import { describe, expect, it } from "vitest"

describe('Bcrypt password service', () => {

    const bcryptPasswordService = new BcryptPasswordService()
    const password = 'Password123.'

    let encryptedPassword: string 

    it('should be able to encrypt a password', async () => {

        encryptedPassword = await bcryptPasswordService.encrypt(password)

        expect(encryptedPassword.trim().length).toBeGreaterThan(0)
        expect(encryptedPassword).not.toBe(password)

    })

    it('should be able to compare a encrypted password with a password', async () => {

        const incorrectComparation = await bcryptPasswordService.compare('Password456.', encryptedPassword)
        const correctComparation = await bcryptPasswordService.compare(password, encryptedPassword)

        expect(incorrectComparation).toBeFalsy()
        expect(correctComparation).toBeTruthy()

    })

})