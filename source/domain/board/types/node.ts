import { Direction } from "./direction"
import { Position } from "./position"
import { Jump } from "./jump"

export type Node = {
    direction: Direction,
    positions: {
        position: Position,
        jumps: Jump[],
        nodes: Node[]
    }[]
}