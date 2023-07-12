export interface PasswordService {
    compare(password: string, encrypted: string): Promise<boolean>
    encrypt(password: string): Promise<string>
}