import { IncorrectEmailOrPassword } from "./errors/incorrect-email-or-password"
import { AccessTokenGateway } from "../contracts/gateways/access-token-gateway"
import { UserRepository } from "../contracts/repositories/user-repository"
import { PasswordGateway } from "../contracts/gateways/password-gateway"
import { Either, right, left } from "../../shared/either"

export interface AuthenticateUserRequest {
    password: string
    email: string
}

export class AuthenticateUserUseCase {

    private readonly accessTokenGateway: AccessTokenGateway
    private readonly passwordGateway: PasswordGateway
    private readonly userRepository: UserRepository

    constructor(accessTokenGateway: AccessTokenGateway, passwordGateway: PasswordGateway, userRepository: UserRepository) {
        this.accessTokenGateway = accessTokenGateway
        this.passwordGateway = passwordGateway
        this.userRepository = userRepository
    }

    async execute({ password, email }: AuthenticateUserRequest): Promise<Either<IncorrectEmailOrPassword, string>> {
        
        const userOrUndefined = await this.userRepository.findByEmail(email)
        
        if (!userOrUndefined)
            return left(new IncorrectEmailOrPassword())
            
        const isNotSamePassword = !(await this.passwordGateway.compare(password, userOrUndefined.password.value))

        if (isNotSamePassword)
            return left(new IncorrectEmailOrPassword())

        const accessToken = await this.accessTokenGateway.generate(userOrUndefined.id.value)

        return right(accessToken)

    }

}