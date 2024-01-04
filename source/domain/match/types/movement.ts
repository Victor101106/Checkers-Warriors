import { Position } from "../../board/types/position"
import { Player } from "../../board/types/player"
import { Jump } from "../../board/types/jump"

export interface Movement {
    positions: Array<Position>
    startsAt: Position
    promoted: boolean
    endsAt: Position
    winner: boolean
    player: Player
    jumps: Array<Jump>
}