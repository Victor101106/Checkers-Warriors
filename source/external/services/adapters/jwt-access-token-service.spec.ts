import { JwtAccessTokenService } from "./jwt-access-token-service"
import { describe, it, expect, beforeAll } from "vitest"
import { InvalidToken } from "../errors/invalid-token"
import { Left, Right } from "../../../shared/either"
import { sign } from "jsonwebtoken"

describe('Jwt access token token service', () => {

    const jwtAccessTokenService = new JwtAccessTokenService()
    const simulatedUserId = '294ab835-4d5cb0fc5ebd'
    
    it('should be able to generate and verify a access token', async () => {

        const accessToken = await jwtAccessTokenService.generate(simulatedUserId)
        expect(accessToken.length).toBeGreaterThan(0)

        const userIdOrError = await jwtAccessTokenService.verify(accessToken)
        expect(userIdOrError).instanceOf(Right)

        const userId = userIdOrError.value as string
        expect(userId).toBe(simulatedUserId)

    })

    it('should not be able to verify a invalid access token', async () => {

        const accessToken = 'ba6a4f51-32cc-413f-b024-f5681a063e31'
        const userIdOrError = await jwtAccessTokenService.verify(accessToken)

        expect(userIdOrError).instanceOf(Left)
        expect(userIdOrError.value).instanceOf(InvalidToken)

    })

    it('should not be able to verify a access token without value on payload', async () => {

        const accessToken = sign({ value: undefined }, <string>process.env.ACCESS_TOKEN_SECRET_KEY)
        const userIdOrError = await jwtAccessTokenService.verify(accessToken)

        expect(userIdOrError).instanceOf(Left)
        expect(userIdOrError.value).instanceOf(InvalidToken)

    })

})