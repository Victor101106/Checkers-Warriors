import { UserRepository } from "../user-repository"
import { User } from "../../../domain/entities/user/user"

export class InMemoryUserRepository implements UserRepository {

    private readonly database: User[] = new Array()

    async findByEmail(email: string): Promise<User | void> {
        return this.database.find(user => user.email.value == email)
    }

    async findById(id: string): Promise<User | void> {
        return this.database.find(user => user.id.value == id)
    }

    async delete(id: string): Promise<User | void> {
        const index = this.database.findIndex(user => user.id.value == id)
        if (index >= 0) return this.database.splice(index, 1)[0]   
    }

    async update(user: User): Promise<void> {
        const index = this.database.findIndex(savedUser => savedUser.id.value == user.id.value)
        if (index >= 0) this.database[index] = user
    }

    async save(user: User): Promise<void> {
        this.database.push(user)
    }

}