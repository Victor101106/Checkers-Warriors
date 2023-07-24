import { MovePieceRequest, MovePieceResponse, MovePieceUseCase } from "../../move-piece-usecase"
import { InvalidOrientation } from "../../../domain/board/errors/invalid-orientation"
import { InvalidPosition } from "../../../domain/board/errors/invalid-position"
import { FindAllMovementsUseCase } from "../../find-all-movements-usecase"
import { InvalidRange } from "../../../domain/board/errors/invalid-range"
import { InvalidMovement } from "../../errors/invalid-movement"
import { Either, left, right } from "../../../shared/either"
import { Piece } from "../../../domain/board/piece"

export class MoveBrazilianPieceUseCase implements MovePieceUseCase {

    private readonly findAllMovementsUseCase: FindAllMovementsUseCase

    constructor(findAllMovementsUseCase: FindAllMovementsUseCase) {
        this.findAllMovementsUseCase = findAllMovementsUseCase
    }

    execute({ startsAt, endsAt, board }: MovePieceRequest): Either<InvalidPosition | InvalidRange | InvalidOrientation | InvalidMovement, MovePieceResponse> {
        
        const pieceOrUndefinedOrError = board.getSpot(startsAt)

        if (pieceOrUndefinedOrError.isLeft() || !pieceOrUndefinedOrError.value)
            return left(new InvalidPosition())
            
        const piece = pieceOrUndefinedOrError.value

        const allCorrectMovementsOrError = this.findAllMovementsUseCase.execute({
            player: piece.player,
            board: board
        })

        if (allCorrectMovementsOrError.isLeft())
            return left(allCorrectMovementsOrError.value)
        
        const allCorrectMovements = allCorrectMovementsOrError.value

        const filteredAllCorrectMovements = allCorrectMovements.filter(
            movement => movement.startsAt.column == startsAt.column && movement.startsAt.row == startsAt.row &&
                        movement.endsAt.column == endsAt.column && movement.endsAt.row == endsAt.row
        )

        if (filteredAllCorrectMovements.length == 0)
            return left(new InvalidMovement())

        const isPromoted = (piece.player == 0 && endsAt.row == board.rows - 1) || (piece.player == 1 && endsAt.row == 0)
        const firstCorrectMovement = filteredAllCorrectMovements[0]

        for (let jump of firstCorrectMovement.jumps) 
            board.deleteSpot(jump.position)
        
        if (isPromoted) {
            
            const promotedPieceOrError = Piece.create({
                orientations: { column: [-1, 1], row: [-1, 1] },
                player: piece.player,    
                range: Infinity
            })

            if (promotedPieceOrError.isLeft())
                return left(promotedPieceOrError.value)
            
            const promotedPiece = promotedPieceOrError.value
            const confirmSet = board.setSpot(startsAt, promotedPiece)

            if (confirmSet.isLeft())
                return left(confirmSet.value)

        }

        const confirmSwap = board.swapSpot(startsAt, endsAt)

        if (confirmSwap.isLeft())
            return left(confirmSwap.value)

        return right({
            positions: firstCorrectMovement.positions,
            jumps: firstCorrectMovement.jumps,
            promoted: isPromoted,
            startsAt: startsAt,
            endsAt: endsAt
        })
        

    }

}