import { IncorrectEmailOrPassword } from "./errors/incorrect-email-or-password"
import { AccessTokenService } from "../external/services/access-token-service"
import { UserRepository } from "../external/repositories/user-repository"
import { PasswordService } from "../external/services/password-service"
import { Either, right, left } from "../shared/either"

export interface AuthenticateUserRequest {
    password: string
    email: string
}

export class AuthenticateUserUseCase {

    private readonly accessTokenService: AccessTokenService
    private readonly passwordService: PasswordService
    private readonly userRepository: UserRepository

    constructor(accessTokenService: AccessTokenService, passwordService: PasswordService, userRepository: UserRepository) {
        this.accessTokenService = accessTokenService
        this.passwordService = passwordService
        this.userRepository = userRepository
    }

    async execute({ password, email }: AuthenticateUserRequest): Promise<Either<IncorrectEmailOrPassword, string>> {
        
        const userOrUndefined = await this.userRepository.findByEmail(email)
        
        if (!userOrUndefined)
            return left(new IncorrectEmailOrPassword())
            
        const isNotSamePassword = !(await this.passwordService.compare(password, userOrUndefined.password.value))

        if (isNotSamePassword)
            return left(new IncorrectEmailOrPassword())

        const accessToken = await this.accessTokenService.generate(userOrUndefined.id.value)

        return right(accessToken)

    }

}