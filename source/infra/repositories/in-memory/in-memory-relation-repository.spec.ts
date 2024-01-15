import { InMemoryRelationRepository } from "./in-memory-relation-repository"
import { Relation } from "../../../domain/entities/relation/relation"
import { Right } from "../../../shared/either"
import { describe, expect, it } from "vitest"

describe('In-memory relation repository', () => {

    const inMemoryRelationRepository = new InMemoryRelationRepository()

    const relationOrError = Relation.create({
        relationId: 'unique-id',
        matchId: 'unique-id',
        userId: 'unique-id'
    })

    expect(relationOrError).instanceOf(Right)

    const relation = relationOrError.value as Relation
    
    it('should be able to save and find by id a user in repository', async () => {

        await inMemoryRelationRepository.save(relation)

        const relationOrUndefined = await inMemoryRelationRepository.findById(relation.relationId.value)
    
        expect(relationOrUndefined).toBe(relation)

    })
    
    it('should not be able to get a user after be deleted in repository', async () => {
        
        await inMemoryRelationRepository.delete(relation.relationId.value)

        const relationOrUndefined = await inMemoryRelationRepository.findById(relation.relationId.value)

        expect(relationOrUndefined).toBeFalsy()

    })

})