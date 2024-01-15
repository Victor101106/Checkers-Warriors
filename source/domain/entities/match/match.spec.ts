import { describe, expect, it } from "vitest"
import { Variation } from "./types/variation"
import { Right } from "../../../shared/either"
import { Board } from "../board/board"
import { User } from "../user/user"
import { Match } from "./match"

describe('Match domain', () => {

    const imaginaryBoard: Board = {} as Board
    const imaginaryUser: User = {} as User

    it('should be able to create a match and reverse the turn', () => {

        const matchOrError = Match.create({
            variation: Variation.Brazilian,
            players: [ imaginaryUser ],
            board: imaginaryBoard,
            movements: [],
            turn: 0
        })

        expect(matchOrError).instanceOf(Right)

        const match = matchOrError.value as Match

        const lastTurn = match.turn 

        match.reverseTurn()

        expect(match.turn).not.toBe(lastTurn)

    })

})