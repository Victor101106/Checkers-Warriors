import { Relation } from "../../domain/relation/relation"

export interface RelationRepository {
    findById(id: string): Promise<Relation | void>
    delete(id: string): Promise<Relation | void>
    save(relation: Relation): Promise<void>
}