import { InvalidToken } from "./errors/invalid-token"
import { Either } from "../../shared/either"

export interface AccessTokenService {
    verify(token: string): Promise<Either<InvalidToken, string>>
    generate(token: string): Promise<string>
}