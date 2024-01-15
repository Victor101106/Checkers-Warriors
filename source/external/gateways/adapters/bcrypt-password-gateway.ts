import { PasswordGateway } from "../password-gateway"
import { compare, hash, genSalt } from 'bcrypt'

export class BcryptPasswordGateway implements PasswordGateway {

    async encrypt(password: string): Promise<string> {
        return hash(password, await genSalt())
    }

    async compare(password: string, encrypted: string): Promise<boolean> {
        return compare(password, encrypted)
    }

}