import { PasswordService } from "../password-service"
import { compare, hash, genSalt } from 'bcrypt'

export class BcryptPasswordService implements PasswordService {

    async encrypt(password: string): Promise<string> {
        return hash(password, await genSalt())
    }

    async compare(password: string, encrypted: string): Promise<boolean> {
        return compare(password, encrypted)
    }

}