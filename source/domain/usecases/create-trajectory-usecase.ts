import { Direction } from "../entities/board/types/direction"
import { Position } from "../entities/board/types/position"
import { Jump } from "../entities/board/types/jump"
import { Board } from "../entities/board/board"

export interface CreateTrajectoryRequest {
    direction: Direction
    startsAt: Position
    board: Board
}

export type CreateTrajectoryResponse = {
    position: Position
    jumps: Jump[]
}[]

export class CreateTrajectoryUseCase {

    execute({ startsAt, direction, board }: CreateTrajectoryRequest): CreateTrajectoryResponse {
        
        const trajectory: CreateTrajectoryResponse = new Array()
        const pieceOrError = board.getSpot(startsAt)
        
        if (pieceOrError.isLeft() || !pieceOrError.value)
            return trajectory
        
        const jumps: Jump[] = new Array() 
        const piece = pieceOrError.value

        let column = startsAt.column + direction.column
        let row    = startsAt.row + direction.row
        let range  = 1

        while(board.validatePosition({column, row})) {

            const futurePosition = { column: column + direction.column, row: row + direction.row}
            const position       = { column, row }
            
            const hasFuturePosition = board.validatePosition(futurePosition)
            const hasFuturePiece    = board.hasPiece(futurePosition)
            const pieceOrError      = board.getSpot(position)
            const pieceOrUndefined  = pieceOrError.isRight() ? pieceOrError.value : undefined
            
            if (hasFuturePosition && !hasFuturePiece && pieceOrUndefined) {
                if (pieceOrUndefined.player == piece.player)
                    break
                jumps.push({ position, piece: pieceOrUndefined })
                range--
            }

            if (hasFuturePiece && pieceOrUndefined)
                break

            if (!pieceOrUndefined) 
                trajectory.push({ position, jumps: [...jumps] })

            if (range == piece.range.value)
                break
            
            if (!pieceOrUndefined && hasFuturePosition && hasFuturePiece)
                range--
            
            column += direction.column
            row    += direction.row
            range  ++

        }

        return trajectory
    }

}