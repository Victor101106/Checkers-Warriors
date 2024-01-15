import { InvalidPassword } from "./errors/invalid-password"
import { Either, left, right } from "../../../shared/either"
import { InvalidEmail } from "./errors/invalid-email"
import { InvalidName } from "./errors/invalid-name"
import { InvalidId } from "./errors/invalid-id"
import { Password } from "./password"
import { Email } from "./email"
import { Name } from "./name"
import { Id } from "./id"

export interface UserRequest {
    password: { value: string, validate?: boolean }
    createdAt?: Date
    email: string
    name: string
    id?: string
}

export class User {

    public readonly password: Password
    public readonly createdAt: Date
    public readonly email: Email
    public readonly name: Name
    public readonly id: Id
    
    private constructor(createdAt: Date, password: Password, email: Email, name: Name, id: Id) {
        this.createdAt = createdAt
        this.password = password
        this.email = email
        this.name = name
        this.id = id
        Object.freeze(this)
    }

    static create(request: UserRequest): Either<InvalidPassword | InvalidEmail | InvalidName | InvalidId, User> {

        const passwordOrError = Password.create(request.password.value, request.password.validate)
        const emailOrError = Email.create(request.email)
        const nameOrError = Name.create(request.name)
        const idOrError = Id.create(request.id)

        if (passwordOrError.isLeft()) return left(passwordOrError.value)
        if (emailOrError.isLeft()) return left(emailOrError.value)
        if (nameOrError.isLeft()) return left(nameOrError.value)
        if (idOrError.isLeft()) return left(idOrError.value)

        const createdAt = request.createdAt || new Date()
        const password = passwordOrError.value
        const email = emailOrError.value
        const name = nameOrError.value
        const id = idOrError.value

        return right(new User(createdAt, password, email, name, id))

    }

}