import { Position } from "./position"
import { Piece } from "../piece"

export interface Jump {
    position: Position
    piece: Piece
}