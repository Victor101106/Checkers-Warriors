import { MatchRepository } from "../match-repository"
import { Match } from "../../../domain/entities/match/match"

export class InMemoryMatchRepository implements MatchRepository {

    private readonly database: Match[] = new Array()

    async save(match: Match): Promise<void> {
        this.database.push(match)
    }

    async delete(id: string): Promise<void | Match> {
        const index = this.database.findIndex(match => match.id.value == id)
        if (index >= 0) return this.database.splice(index, 1)[0]            
    }

    async update(match: Match): Promise<void> {
        const index = this.database.findIndex(savedMatch => savedMatch.id.value == match.id.value)
        if (index >= 0) this.database[index] = match
    }

    async findById(id: string): Promise<void | Match> {
        return this.database.find(match => match.id.value == id)
    }

}