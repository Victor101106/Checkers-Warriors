import { describe, expect, it } from "vitest"
import { Variation } from "./types/variation"
import { Right } from "../../shared/either"
import { Board } from "../board/board"
import { Match } from "./match"
import { Id } from "../user/id"

describe('Match domain', () => {

    const imaginaryBoard: Board = {} as Board
    const imaginaryId: Id = {} as Id

    it('should be able to create a match and reverse the turn', () => {

        const matchOrError = Match.create({
            variation: Variation.Brazilian,
            players: [ imaginaryId ],
            board: imaginaryBoard,
            turn: 0
        })

        expect(matchOrError).instanceOf(Right)

        const match = matchOrError.value as Match

        const lastTurn = match.turn 

        match.reverseTurn()

        expect(match.turn).not.toBe(lastTurn)

    })

})