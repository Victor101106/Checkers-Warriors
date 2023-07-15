import { InMemoryMatchRepository } from "./in-memory-match-repository"
import { Right } from "../../../shared/either"
import { describe, expect, it } from "vitest"
import { Match } from "../../../domain/match/match"
import { CreateBrazilianBoardUseCase } from "../../../usecases/adapters/create-board/create-brazilian-board-usecase"
import { Board } from "../../../domain/board/board"
import { Id } from "../../../domain/user/id"
import { Variation } from "../../../domain/match/types/variation"

describe('In-memory user repository', () => {

    const createBrazilianBoardUseCase = new CreateBrazilianBoardUseCase()
    const inMemoryMatchRepository = new InMemoryMatchRepository()

    const boardOrError = createBrazilianBoardUseCase.execute()

    expect(boardOrError).instanceOf(Right)
    const board = boardOrError.value as Board

    const idOrError = Id.create()

    expect(idOrError).instanceOf(Right)
    const id = idOrError.value as Id
    
    const matchOrError = Match.create({
        variation: Variation.Brazilian,
        players: [ id ],
        board: board
    })

    expect(matchOrError).instanceOf(Right)
    const match = matchOrError.value as Match

    it('should be able to save and find by id a match in repository', async () => {

        await inMemoryMatchRepository.save(match)

        const matchOrUndefined = await inMemoryMatchRepository.findById(match.id.value)
    
        expect(matchOrUndefined).toBe(match)

    })

    it('should be able to update a user in repository', async () => {

        const updatedMatchOrError = Match.create({
            variation: match.variation,
            createdAt: match.createdAt,
            players: match.players,
            board: match.board,
            id: match.id.value,
            turn: 1
        })

        expect(updatedMatchOrError).instanceOf(Right)

        const updateMatch = updatedMatchOrError.value as Match

        await inMemoryMatchRepository.update(updateMatch)

        const matchOrUndefined = await inMemoryMatchRepository.findById(updateMatch.id.value)

        expect(matchOrUndefined).toBe(updateMatch)

    })
    
    it('should not be able to get a match after be deleted in repository', async () => {
        
        await inMemoryMatchRepository.delete(match.id.value)

        const matchOrUndefined = await inMemoryMatchRepository.findById(match.id.value)

        expect(matchOrUndefined).toBeFalsy()

    })

})