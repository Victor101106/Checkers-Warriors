import { InMemoryMatchRepository } from "./in-memory-match-repository"
import { Right } from "../../@shared/either"
import { describe, expect, it } from "vitest"
import { Match } from "../../domain/entities/match/match"
import { CreateBrazilianBoardUseCase } from "../../domain/usecases/adapters/create-board/create-brazilian-board-usecase"
import { Board } from "../../domain/entities/board/board"
import { Variation } from "../../domain/entities/match/types/variation"
import { User } from "../../domain/entities/user/user"

describe('In-memory user repository', () => {

    const createBrazilianBoardUseCase = new CreateBrazilianBoardUseCase()
    const inMemoryMatchRepository = new InMemoryMatchRepository()

    const boardOrError = createBrazilianBoardUseCase.execute()

    expect(boardOrError).instanceOf(Right)
    const board = boardOrError.value as Board

    const userOrError = User.create({
        password: { value: 'User123.' },
        email: 'user@gmail.com',
        name: 'User',
    })

    expect(userOrError).instanceOf(Right)
    const user = userOrError.value as User
    
    const matchOrError = Match.create({
        variation: Variation.Brazilian,
        movements: new Array(),
        players: [ user ],
        board: board,
        turn: 0
    })

    expect(matchOrError).instanceOf(Right)
    const match = matchOrError.value as Match

    it('should be able to save and find by id a match in repository', async () => {

        await inMemoryMatchRepository.save(match)

        const matchOrUndefined = await inMemoryMatchRepository.findById(match.id.value)
    
        expect(matchOrUndefined).toBe(match)

    })

    it('should be able to get a random unfinished match in repository', async () => {

        const matchOrUndefined = await inMemoryMatchRepository.getUnfinishedRandom()
    
        expect(matchOrUndefined).toBeInstanceOf(Match)
        expect(matchOrUndefined?.winner).toBeFalsy()

    })

    it('should be able to update a user in repository', async () => {

        const updatedMatchOrError = Match.create({
            movements: match.movements,
            variation: match.variation,
            createdAt: match.createdAt,
            players: match.players,
            board: match.board,
            id: match.id.value,
            winner: 1,
            turn: 1
        })

        expect(updatedMatchOrError).instanceOf(Right)

        const updateMatch = updatedMatchOrError.value as Match

        await inMemoryMatchRepository.update(updateMatch)

        const matchOrUndefined = await inMemoryMatchRepository.findById(updateMatch.id.value)

        expect(matchOrUndefined).toBe(updateMatch)

    })

    it('should not be able to get a random unfinished match in repository', async () => {

        const matchOrUndefined = await inMemoryMatchRepository.getUnfinishedRandom()
    
        expect(matchOrUndefined).toBeUndefined()

    })
    
    it('should not be able to get a match after be deleted in repository', async () => {
        
        await inMemoryMatchRepository.delete(match.id.value)

        const matchOrUndefined = await inMemoryMatchRepository.findById(match.id.value)

        expect(matchOrUndefined).toBeFalsy()

    })

})