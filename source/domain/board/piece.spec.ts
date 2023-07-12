import { InvalidRange } from "./errors/invalid-range"
import { Left, Right } from "../../shared/either"
import { describe, expect, it } from "vitest"
import { Piece } from "./piece"

describe('Piece domain', () => {

    it('should be able to create a valid piece', () => {

        const object = Piece.create({
            orientations: {
                column: [-1, 0, 1],
                row: [-1, 0, 1]
            },
            player: 0,
            range: Infinity
        })

        expect(object).instanceOf(Right)

        if (object.isRight()) {
            expect(object.value).instanceOf(Piece)
        }

    })

    it('should not be able to create a piece with a invalid range', () => {

        const object = Piece.create({
            orientations: {
                column: [-1, 0, 1],
                row: [-1, 0, 1]
            },
            player: 0,
            range: -Infinity
        })

        expect(object).instanceOf(Left)

        if (object.isLeft()) {
            expect(object.value).instanceOf(InvalidRange)
        }

    })

})