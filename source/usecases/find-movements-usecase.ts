import { InvalidPosition } from "../domain/board/errors/invalid-position"
import { Position } from "../domain/board/types/position"
import { Either, left, right } from "../shared/either"
import { Node } from "../domain/board/types/node"
import { Jump } from "../domain/board/types/jump"
import { Board } from "../domain/board/board"

export interface FindMovementsRequest {
    nodes: Array<Node>
    startsAt: Position
    board: Board
}

export type FindMovementsResponse = {
    positions: Position[]
    endsAt: Position
    jumps: Jump[]
}[]

export class FindMovementsUseCase {

    execute({ startsAt, nodes, board }: FindMovementsRequest): Either<InvalidPosition, FindMovementsResponse> {

        const pieceOrError = board.getSpot(startsAt)
        
        if (pieceOrError.isLeft() || !pieceOrError.value)
            return left(new InvalidPosition())

        const piece = pieceOrError.value

        const unfilteredMovements = this.findUnfilteredMovements(nodes)        
        const filteredMovements = unfilteredMovements.filter(movement => {

            const hasColumnOrientation = movement.positions.length && piece.orientations.column.has((movement.positions[0].column - startsAt.column) < 0 ? -1 : 1)
            const hasRowOrientation = movement.positions.length && piece.orientations.row.has((movement.positions[0].row - startsAt.row) < 0 ? -1 : 1)

            return movement.jumps.length || (hasColumnOrientation && hasRowOrientation)

        })

        return right(filteredMovements)

    }

    private findUnfilteredMovements(nodes: Array<Node>): FindMovementsResponse {
        
        let movements: FindMovementsResponse = new Array()
        let score: number = 0

        for (let node of nodes) {
            
            for (let item of node.positions) {

                let positions: Position[]
                let endsAt: Position
                let jumps: Jump[]

                const childs = this.findUnfilteredMovements(item.nodes)

                for (let child of childs) {

                    positions = [item.position, ...child.positions]
                    endsAt = child.endsAt
                    jumps = child.jumps

                    if (jumps.length > score) {
                        score = jumps.length
                        movements = [{ positions, endsAt, jumps }]
                    } else if (jumps.length == score) {
                        movements.push({ positions, endsAt, jumps })
                    }

                }

                if ((!childs.length && !movements.length) || (!childs.length && item.jumps.length > score)) {
                    score = item.jumps.length
                    movements = [{
                        positions: [item.position], 
                        endsAt: item.position, 
                        jumps: item.jumps
                    }]
                } else if (!childs.length && item.jumps.length == score) {
                    movements.push({
                        positions: [item.position], 
                        endsAt: item.position, 
                        jumps: item.jumps
                    })
                }

            }

        }

        return movements

    }

}