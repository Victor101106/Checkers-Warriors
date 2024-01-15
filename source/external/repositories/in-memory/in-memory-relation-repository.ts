import { Relation } from "../../../domain/entities/relation/relation"
import { RelationRepository } from "../relation-repository"

export class InMemoryRelationRepository implements RelationRepository {

    private readonly database: Relation[] = new Array()

    async findById(id: string): Promise<Relation | void> {
        return this.database.find(relation => relation.relationId.value == id)
    }

    async delete(id: string): Promise<Relation | void> {
        const index = this.database.findIndex(relation => relation.relationId.value == id)
        if (index >= 0) return this.database.splice(index, 1)[0]   
    }

    async save(relation: Relation): Promise<void> {
        this.database.push(relation)
    }

}