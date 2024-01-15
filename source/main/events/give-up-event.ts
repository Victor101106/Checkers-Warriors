import { giveUpSocketHelper } from "../factories/main/events/helpers/give-up-event-helper-factory"
import { Server, Socket } from "socket.io"

module.exports = (socket: Socket, server: Server) => {

    socket.on('give-up', async (event) => {

        const responseOrError = await giveUpSocketHelper.execute({
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