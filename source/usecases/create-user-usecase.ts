import { UserRepository } from "../external/repositories/user-repository"
import { UniqueIdService } from "../external/services/unique-id-service"
import { PasswordService } from "../external/services/password-service"
import { InvalidPassword } from "../domain/user/errors/invalid-password"
import { EmailAlreadyInUse } from "./errors/email-already-in-use"
import { Either, left, right } from "../shared/either"
import { Password } from "../domain/user/password"
import { User } from "../domain/user/user"

export interface CreateUserRequest {
    password: string
    email: string
    name: string
}

export class CreateUserUseCase {

    private readonly passwordService: PasswordService
    private readonly uniqueIdService: UniqueIdService
    private readonly userRepository: UserRepository

    constructor(passwordService: PasswordService, uniqueIdService: UniqueIdService, userRepository: UserRepository) {
        this.passwordService = passwordService
        this.uniqueIdService = uniqueIdService
        this.userRepository = userRepository
    }

    async execute({ password, email, name }: CreateUserRequest): Promise<Either<EmailAlreadyInUse | InvalidPassword | Error, User>> {

        const isEmailAlreadyInUse = await this.userRepository.findByEmail(email)

        if (isEmailAlreadyInUse)
            return left(new EmailAlreadyInUse())
        
        const isInvalidPassword = !Password.validatePassword(password)

        if (isInvalidPassword)
            return left(new InvalidPassword())
        
        const encrypted = await this.passwordService.encrypt(password)
        const uniqueId = await this.uniqueIdService.generate()

        const userOrError = User.create({
            password: { value: encrypted, validate: false },
            email: email,
            name: name,
            id: uniqueId
        })

        if (userOrError.isLeft())
            return left(userOrError.value)
        
        const user = userOrError.value

        await this.userRepository.save(user)

        return right(user)

    }

}