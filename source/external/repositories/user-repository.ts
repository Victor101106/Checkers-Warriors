import { User } from "../../domain/entities/user/user"

export interface UserRepository {
    findByEmail(email: string): Promise<User | void>
    findById(id: string): Promise<User | void>
    delete(id: string): Promise<User | void>
    update(user: User): Promise<void>
    save(user: User): Promise<void>
}