import { UuidUniqueIdGateway } from "./uuid-unique-id-gateway"
import { describe, expect, it } from "vitest"

describe('UUID unique id gateway', () => {

    it('should be able to generate a unique id', async () => {

        const uuidUniqueIdGateway = new UuidUniqueIdGateway()

        const uniqueId = await uuidUniqueIdGateway.generate()

        expect(uniqueId.trim().length).toBeGreaterThan(0)

    })

})