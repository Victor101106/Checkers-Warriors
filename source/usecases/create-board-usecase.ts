import { InvalidOrientation } from "../domain/board/errors/invalid-orientation"
import { InvalidPosition } from "../domain/board/errors/invalid-position"
import { InvalidMeasure } from "../domain/board/errors/invalid-measure"
import { InvalidRange } from "../domain/board/errors/invalid-range"
import { Board } from "../domain/board/board"
import { Either } from "../shared/either"

export interface CreateBoardUseCase {
    execute(): Either<InvalidMeasure | InvalidRange | InvalidOrientation | InvalidPosition, Board>
}