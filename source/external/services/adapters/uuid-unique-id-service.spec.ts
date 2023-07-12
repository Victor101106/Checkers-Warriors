import { UuidUniqueIdService } from "./uuid-unique-id-service"
import { describe, expect, it } from "vitest"

describe('UUID unique id service', () => {

    it('should be able to generate a unique id', async () => {

        const uuidUniqueIdService = new UuidUniqueIdService()

        const uniqueId = await uuidUniqueIdService.generate()

        expect(uniqueId.trim().length).toBeGreaterThan(0)

    })

})