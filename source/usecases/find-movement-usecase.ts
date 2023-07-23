import { Position } from "../domain/board/types/position"
import { Jump } from "../domain/board/types/jump"
import { Node } from "../domain/board/types/node"

export type FindMovementRequest = Array<Node>

export type FindMovementResponse = {
    positions: Position[]
    endsAt: Position
    jumps: Jump[]
}[]

export class FindMovementUseCase {
    
    execute(nodes: FindMovementRequest): FindMovementResponse {
        
        let movements: FindMovementResponse = new Array()
        let score: number = 0

        for (let node of nodes) {
            
            for (let item of node.positions) {

                let positions: Position[]
                let endsAt: Position
                let jumps: Jump[]

                const childs = this.execute(item.nodes)

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