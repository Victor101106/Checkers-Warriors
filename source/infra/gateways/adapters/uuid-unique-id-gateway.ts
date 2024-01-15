import { UniqueIdGateway } from "../unique-id-gateway"
import { v4 as uuidv4 } from 'uuid'

export class UuidUniqueIdGateway implements UniqueIdGateway {
    async generate(): Promise<string> {
        return uuidv4()
    }
}