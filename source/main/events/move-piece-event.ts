import { movePieceSocketProcessor } from "../factories/application/processors/move-piece-socket-processor-factory"
import { Server, Socket } from "socket.io"

module.exports = (socket: Socket, server: Server) => {

    socket.on('move-piece', async (event) => {

        const responseOrError = await movePieceSocketProcessor.execute({
            startsAt: event?.startsAt,
            endsAt: event?.endsAt,
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