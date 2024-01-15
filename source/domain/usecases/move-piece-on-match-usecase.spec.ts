import { InMemoryMatchRepository } from "../../external/repositories/in-memory/in-memory-match-repository"
import { InMemoryUserRepository } from "../../external/repositories/in-memory/in-memory-user-repository"
import { bcryptPasswordGateway } from "../../external/gateways/factory/password-gateway-factory"
import { uuidUniqueIdGateway } from "../../external/gateways/factory/unique-id-gateway-factory"
import { createBrazilianBoardUseCase } from "./factory/create-board-usecase-factory"
import { moveBrazilianPieceUseCase } from "./factory/move-piece-usecase-factory"
import { MovePieceOnMatchUseCase } from "./move-piece-on-match-usecase"
import { Variation } from "../entities/match/types/variation"
import { CreateMatchUseCase } from "./create-match-usecase"
import { CreateUserUseCase } from "./create-user-usecase"
import { InvalidTurn } from "./errors/invalid-turn"
import { Left, Right } from "../../shared/either"
import { Match } from "../entities/match/match"
import { describe, expect, it } from "vitest"
import { User } from "../entities/user/user"

describe('Create match use case', async () => {

    const inMemoryMatchRepository = new InMemoryMatchRepository()
    const inMemoryUserRepository = new InMemoryUserRepository()

    const createMatchUseCase = new CreateMatchUseCase([ createBrazilianBoardUseCase ], uuidUniqueIdGateway, inMemoryMatchRepository, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordGateway, uuidUniqueIdGateway, inMemoryUserRepository)
    
    const movePieceOnMatchUseCase = new MovePieceOnMatchUseCase([ moveBrazilianPieceUseCase ], inMemoryMatchRepository)

    const userOrError = await createUserUseCase.execute({
        password: 'Password123.',
        email: 'email@mail.com',
        name: 'Name'
    })

    expect(userOrError).instanceOf(Right)

    const user = userOrError.value as User

    const brazilianMatchOrError = await createMatchUseCase.execute({
        variation: Variation.Brazilian,
        userId: user.id.value,
    })

    expect(brazilianMatchOrError).instanceOf(Right)

    const brazilianMatch = brazilianMatchOrError.value as Match

    it('should be able to move a piece brazilian on match in a valid turn', async () => {
        
        const turn = brazilianMatch.turn
        const score = brazilianMatch.score[turn]

        const confirmOrError = await movePieceOnMatchUseCase.execute({
            startsAt: { column: 1, row: 2 },
            endsAt:   { column: 2, row: 3 },
            matchId: brazilianMatch.id.value,
            userId: user.id.value
        })
        
        if ((<any>confirmOrError.value).jumps?.length)
            expect(brazilianMatch.score[turn]).not.toBe(score)

        expect(confirmOrError).instanceOf(Right)

    })

    it('should not be able to move a piece brazilian on match in a invalid turn', async () => {
        
        const confirmOrError = await movePieceOnMatchUseCase.execute({
            startsAt: { column: 2, row: 3 },
            endsAt:   { column: 3, row: 4 },
            matchId: brazilianMatch.id.value,
            userId: user.id.value
        })
        
        expect(confirmOrError).instanceOf(Left)
        expect(confirmOrError.value).instanceOf(InvalidTurn)

    })

})