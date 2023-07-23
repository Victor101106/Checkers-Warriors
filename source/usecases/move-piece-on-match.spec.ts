import { InMemoryMatchRepository } from "../external/repositories/in-memory/in-memory-match-repository"
import { InMemoryUserRepository } from "../external/repositories/in-memory/in-memory-user-repository"
import { CreateBrazilianBoardUseCase } from "./adapters/create-board/create-brazilian-board-usecase"
import { FindAllPlayerCorrectMovementsUseCase } from "./find-all-player-correct-movements-usecase"
import { MoveBrazilianPieceUseCase } from "./adapters/move-piece/move-brazilian-piece-usecase"
import { BcryptPasswordService } from "../external/services/adapters/bcrypt-password-service"
import { UuidUniqueIdService } from "../external/services/adapters/uuid-unique-id-service"
import { FindCorrectMovementUseCase } from "./find-correct-movements-usecase"
import { CreateMovementTreeUseCase } from "./create-movement-tree-usecase"
import { CreateTrajectoryUseCase } from "./create-trajectory-usecase"
import { MovePieceOnMatchUseCase } from "./move-piece-on-match"
import { Variation } from "../domain/match/types/variation"
import { CreateMatchUseCase } from "./create-match-usecase"
import { CreateUserUseCase } from "./create-user-usecase"
import { InvalidTurn } from "./errors/invalid-turn"
import { Left, Right } from "../shared/either"
import { Match } from "../domain/match/match"
import { describe, expect, it } from "vitest"
import { User } from "../domain/user/user"
import { FindMovementUseCase } from "./find-movement-usecase"

describe('Create match use case', async () => {

    const createBrazilianBoardUseCase = new CreateBrazilianBoardUseCase()
    const inMemoryMatchRepository = new InMemoryMatchRepository()
    const inMemoryUserRepository = new InMemoryUserRepository()
    const uuidUniqueIdService = new UuidUniqueIdService()
    const bcryptPasswordService = new BcryptPasswordService()

    const createMatchUseCase = new CreateMatchUseCase([ createBrazilianBoardUseCase ], uuidUniqueIdService, inMemoryMatchRepository, inMemoryUserRepository)
    const createUserUseCase = new CreateUserUseCase(bcryptPasswordService, uuidUniqueIdService, inMemoryUserRepository)
    const createTrajectoryUseCase = new CreateTrajectoryUseCase()
    const createMovementTreeUseCase = new CreateMovementTreeUseCase(createTrajectoryUseCase)
    const findMovementUseCase = new FindMovementUseCase()
    const findCorrectMovementUseCase = new FindCorrectMovementUseCase(findMovementUseCase)
    const findAllPlayerCorrectMovementsUseCase = new FindAllPlayerCorrectMovementsUseCase(findCorrectMovementUseCase, createMovementTreeUseCase)
    const moveBrazilianPieceUseCase = new MoveBrazilianPieceUseCase(findAllPlayerCorrectMovementsUseCase)
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
        
        const confirmOrError = await movePieceOnMatchUseCase.execute({
            startsAt: { column: 1, row: 2 },
            endsAt:   { column: 2, row: 3 },
            matchId: brazilianMatch.id.value,
            userId: user.id.value
        })
        
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