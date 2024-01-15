import { Either, left, right } from "../../shared/either"
import { AccessTokenGateway } from "../../domain/contracts/gateways/access-token-gateway"
import { InvalidToken } from "../../domain/contracts/gateways/errors/invalid-token"
import { sign, verify } from 'jsonwebtoken'
import { env } from "../../main/configs/env"
 
export class JwtAccessTokenGateway implements AccessTokenGateway {

    async generate(value: string): Promise<string> {
        return sign({value}, env.accessTokenSecretKey, { expiresIn: '30d' })
    }

    async verify(token: string): Promise<Either<InvalidToken, string>> {
        try {
            const payload = verify(token, env.accessTokenSecretKey) as any
            if (!payload?.value) return left(new InvalidToken())
            return right(String(payload.value))
        } catch {
            return left(new InvalidToken())
        }
    }

}