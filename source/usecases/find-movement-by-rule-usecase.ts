import { Position } from "../domain/board/types/position"
import { Jump } from "../domain/board/types/jump"
import { Node } from "../domain/board/types/node"

export type FindMovementByRuleRequest = Array<Node>

export type FindMovementByRuleResponse = {
    positions: Position[]
    endsAt: Position
    jumps: Jump[]
    score: number
}[]

export interface FindMovementByRuleUseCase {
    execute(request: FindMovementByRuleRequest): FindMovementByRuleResponse
}