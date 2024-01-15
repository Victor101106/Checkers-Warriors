import { movePieceSocketHelper } from "../factories/main/events/helpers/move-piece-event-helper-factory"
import { InvalidParameters } from "../../application/errors/invalid-parameters"
import { Server, Socket } from "socket.io"
import { z } from "zod"

module.exports = (socket: Socket, server: Server) => {

    socket.on('move-piece', async (event) => {

        const positionSchema = z.object({ column: z.number(), row: z.number() })

        const startsAtSafeParse = positionSchema.safeParse(event.startsAt)
        const endsAtSafeParse = positionSchema.safeParse(event.endsAt)

        if (!startsAtSafeParse.success || !endsAtSafeParse.success)
            return socket.emit('move-piece-rejected', new InvalidParameters())

        const responseOrError = await movePieceSocketHelper.execute({
            startsAt: startsAtSafeParse.data,
            endsAt: endsAtSafeParse.data,
            relationId: socket.id
        })

        if (responseOrError.isLeft())
            return socket.emit('move-piece-rejected', responseOrError.value)

        const response = responseOrError.value

        server.to(response.matchId.value).emit('move-piece', {
            positions: response.positions,
            promoted: response.promoted,
            startsAt: response.startsAt,
            winner: response.winner,
            endsAt: response.endsAt,
            jumps: response.jumps
        })

    })

}