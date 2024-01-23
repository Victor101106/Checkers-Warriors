import { InvalidOrientation } from "../entities/board/errors/invalid-orientation"
import { InvalidPosition } from "../entities/board/errors/invalid-position"
import { InvalidMeasure } from "../entities/board/errors/invalid-measure"
import { InvalidRange } from "../entities/board/errors/invalid-range"
import { Board } from "../entities/board/board"
import { Either } from "../../@shared/either"

export interface CreateBoardUseCase {
    execute(): Either<InvalidMeasure | InvalidRange | InvalidOrientation | InvalidPosition, Board>
}