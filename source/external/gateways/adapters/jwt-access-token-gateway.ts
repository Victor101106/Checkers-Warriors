import { Either, left, right } from "../../../shared/either"
import { AccessTokenGateway } from "../access-token-gateway"
import { InvalidToken } from "../errors/invalid-token"
import { sign, verify } from 'jsonwebtoken'
 
export class JwtAccessTokenGateway implements AccessTokenGateway {

    async generate(value: string): Promise<string> {
        return sign({value}, <string>process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '30d' })
    }

    async verify(token: string): Promise<Either<InvalidToken, string>> {
        try {
            const payload = verify(token, <string>process.env.ACCESS_TOKEN_SECRET_KEY) as any
            if (!payload?.value) return left(new InvalidToken())
            return right(String(payload.value))
        } catch {
            return left(new InvalidToken())
        }
    }

}