import { InvalidPosition } from "../domain/board/errors/invalid-position"
import { CreateTrajectoryUseCase } from "./create-trajectory-usecase"
import { Direction } from "../domain/board/types/direction"
import { Position } from "../domain/board/types/position"
import { Either, left, right } from "../shared/either"
import { Jump } from "../domain/board/types/jump"
import { Node } from "../domain/board/types/node"
import { Board } from "../domain/board/board"

export interface CreateMovementTreeRequest {
    allowedDirections: Array<Direction>,
    startsAt: Position
    board: Board
}

export interface CreateNodesRequest extends CreateMovementTreeRequest {
    parent?: {
        direction: Direction
        jumps: Array<Jump> 
    }
}   

export class CreateMovementTreeUseCase {

    private readonly createTrajectoryUseCase: CreateTrajectoryUseCase

    constructor(createTrajectoryUseCase: CreateTrajectoryUseCase) {
        this.createTrajectoryUseCase = createTrajectoryUseCase
    }

    execute({ allowedDirections, startsAt, board }: CreateMovementTreeRequest): Either<InvalidPosition, Array<Node>> {

        const hasNotDirections = allowedDirections.length == 0
        const hasNotPiece = !board.hasPiece(startsAt)

        if (hasNotPiece)
            return left(new InvalidPosition())
        
        if (hasNotDirections)
            return right(new Array())
        
        return right(this.createNodes({
            allowedDirections: allowedDirections,
            startsAt: startsAt,
            board: board
        }))

    }

    private createNodes({ allowedDirections, startsAt, parent, board }: CreateNodesRequest): Array<Node>  {

        const directions = allowedDirections.filter(direction => direction.row != parent?.direction.row || direction.column != parent?.direction.column)
        const nodes: Array<Node> = new Array<Node>()

        for (let direction of directions) {

            const trajectory = this.createTrajectoryUseCase.execute({ startsAt, direction, board })
            const positions: Array<any> = new Array<any>()

            for (let spot of trajectory) {

                const clonedBoard = board.cloneBoard()

                for (let jump of spot.jumps)
                    clonedBoard.deleteSpot(jump.position)
                
                if (spot.jumps.length > 0)
                    clonedBoard.swapSpot(spot.position, startsAt)
                
                const oppositeDirection = {
                    column: <1 | -1>(direction.column * -1),
                    row: <1 | -1>(direction.row * -1)
                }

                const totalJumps = [
                    ...parent?.jumps || [],
                    ...spot.jumps
                ]

                const newNodes = spot.jumps.length > 0 ? this.createNodes({
                    allowedDirections: allowedDirections,
                    startsAt: spot.position,
                    board: clonedBoard,
                    parent: {
                        direction: oppositeDirection,
                        jumps: totalJumps,
                    }
                }).filter(node => node.positions.find(spot => spot.jumps.length > totalJumps.length)) : []

                positions.push({ 
                    position: spot.position, 
                    jumps: totalJumps,
                    nodes: newNodes
                })

            }

            nodes.push({ positions, direction })

        }

        return nodes.filter(node => node.positions.length)

    }

}