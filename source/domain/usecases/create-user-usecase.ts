import { UserRepository } from "../../infra/repositories/user-repository"
import { UniqueIdGateway } from "../../infra/gateways/unique-id-gateway"
import { PasswordGateway } from "../../infra/gateways/password-gateway"
import { InvalidPassword } from "../entities/user/errors/invalid-password"
import { EmailAlreadyInUse } from "./errors/email-already-in-use"
import { Either, left, right } from "../../shared/either"
import { Password } from "../entities/user/password"
import { User } from "../entities/user/user"

export interface CreateUserRequest {
    password: string
    email: string
    name: string
}

export class CreateUserUseCase {

    private readonly passwordGateway: PasswordGateway
    private readonly uniqueIdGateway: UniqueIdGateway
    private readonly userRepository: UserRepository

    constructor(passwordGateway: PasswordGateway, uniqueIdGateway: UniqueIdGateway, userRepository: UserRepository) {
        this.passwordGateway = passwordGateway
        this.uniqueIdGateway = uniqueIdGateway
        this.userRepository = userRepository
    }

    async execute({ password, email, name }: CreateUserRequest): Promise<Either<EmailAlreadyInUse | InvalidPassword | Error, User>> {

        const isEmailAlreadyInUse = await this.userRepository.findByEmail(email)

        if (isEmailAlreadyInUse)
            return left(new EmailAlreadyInUse())
        
        const isInvalidPassword = !Password.validatePassword(password)

        if (isInvalidPassword)
            return left(new InvalidPassword())
        
        const encrypted = await this.passwordGateway.encrypt(password)
        const uniqueId = await this.uniqueIdGateway.generate()

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