import { giveUpSocketProcessor } from "../factories/application/processors/give-up-socket-processor-factory"
import { Server, Socket } from "socket.io"

module.exports = (socket: Socket, server: Server) => {

    socket.on('give-up', async (event) => {

        const responseOrError = await giveUpSocketProcessor.execute({
            relationId: socket.id
        })

        if (responseOrError.isLeft())
            return socket.emit('give-up-rejected', responseOrError.value)

        const response = responseOrError.value

        server.to(response.matchId.value).emit('abandoned-match', {
            winner: response.winner
        })

    })

}