import { Relation } from "../../entities/relation/relation"

export interface RelationRepository {
    findById(id: string): Promise<Relation | void>
    delete(id: string): Promise<Relation | void>
    save(relation: Relation): Promise<void>
}