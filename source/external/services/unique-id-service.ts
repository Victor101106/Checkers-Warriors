export interface UniqueIdService {
    generate(): Promise<string>
}