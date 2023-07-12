import { UniqueIdService } from "../unique-id-service"
import { v4 as uuidv4 } from 'uuid'

export class UuidUniqueIdService implements UniqueIdService {
    async generate(): Promise<string> {
        return uuidv4()
    }
}