import { joinMatchSocketProcessor } from "../factories/application/processors/join-match-socket-processor-factory"
import { Server, Socket } from "socket.io"

module.exports = (socket: Socket, server: Server) => {

    socket.on('join-match', async (event) => {

        const responseOrError = await joinMatchSocketProcessor.execute({ relationId: socket.id })

        if (responseOrError.isLeft())
            return socket.emit('join-match-rejected', responseOrError.value)
    
        const { match, player, indexOf } = responseOrError.value

        server.to(match.id.value).emit('player-joined', { player })
        socket.emit('join-match-accepted', { indexOf })

    })

}