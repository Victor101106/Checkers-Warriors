import { Movement } from "../../../domain/entities/match/types/movement"
import { JumpPresenter } from "./jump-presenter"

export class MovementPresenter {

    static toJSON(movement: Movement) {

        const transformedJumps = movement.jumps.map(jump => JumpPresenter.toJSON(jump))

        return {
            positions: movement.positions,
            startsAt: movement.startsAt,
            promoted: movement.promoted,
            endsAt: movement.endsAt,
            player: movement.player,
            winnner: movement.winner,
            jumps: transformedJumps
        }

    }

}