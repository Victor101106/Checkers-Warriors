import { createTrajectoryUseCase } from "./factory/create-trajectory-usecase-factory"
import { createBrazilianBoardUseCase } from "./factory/create-board-usecase-factory"
import { Direction } from "../domain/board/types/direction"
import { Position } from "../domain/board/types/position"
import { describe, expect, it } from "vitest"
import { Board } from "../domain/board/board"
import { Right } from "../shared/either"

describe('Create trajectory use case', () => {
    
    const boardOrError = createBrazilianBoardUseCase.execute()

    expect(boardOrError).instanceOf(Right)

    const board = boardOrError.value as Board

    it('should be able to create a horizontal trajectory', () => {

        const direction: Direction = { column: 1, row: 1 }
        const position: Position =   { column: 1, row: 2 }

        const trajectory = createTrajectoryUseCase.execute({
            direction: direction,
            startsAt: position, 
            board: board
        })

        expect(trajectory.length).toBeGreaterThan(0)
        
        for (let spot of trajectory) {
            position.column += direction.column
            position.row += direction.row
            expect(spot.position.column).toBe(position.column)
            expect(spot.position.row).toBe(position.row)
        }

    })

    it('should be able to create a vertical trajectory', () => {

        const direction: Direction = { column: 0, row: 1 }
        const position: Position =   { column: 1, row: 2 }

        const trajectory = createTrajectoryUseCase.execute({
            direction: direction,
            startsAt: position, 
            board: board
        })

        expect(trajectory.length).toBeGreaterThan(0)
        
        for (let spot of trajectory) {
            position.column += direction.column
            position.row += direction.row
            expect(spot.position.column).toBe(position.column)
            expect(spot.position.row).toBe(position.row)
        }

    })

})