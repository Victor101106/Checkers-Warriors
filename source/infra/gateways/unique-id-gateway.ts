export interface UniqueIdGateway {
    generate(): Promise<string>
}