import { Match } from "../../domain/entities/match/match"

export interface MatchRepository {
    findById(id: string): Promise<Match | void>
    delete(id: string): Promise<Match | void>
    update(match: Match): Promise<void>
    save(match: Match): Promise<void>
}