export interface PasswordGateway {
    compare(password: string, encrypted: string): Promise<boolean>
    encrypt(password: string): Promise<string>
}