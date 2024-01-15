import { InvalidToken } from "./errors/invalid-token"
import { Either } from "../../shared/either"

export interface AccessTokenGateway {
    verify(token: string): Promise<Either<InvalidToken, string>>
    generate(token: string): Promise<string>
}