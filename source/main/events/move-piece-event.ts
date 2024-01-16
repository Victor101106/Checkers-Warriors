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
        const matchId  = response.matchId

        delete response.matchId

        server.to(matchId).emit('move-piece', response)

    })

}