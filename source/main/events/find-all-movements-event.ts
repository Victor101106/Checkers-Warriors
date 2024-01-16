import { findAllMovementsSocketProcessor } from "../factories/application/processors/find-all-movements-socket-processor-factory"
import { Server, Socket } from "socket.io"

module.exports = (socket: Socket, server: Server) => {

    socket.on('find-all-movements', async (event) => {

        const responseOrError = await findAllMovementsSocketProcessor.execute({ relationId: socket.id })

        if (responseOrError.isLeft())
            return socket.emit('find-all-movements-rejected', responseOrError.value)

        socket.emit('find-all-movements-accepted', responseOrError.value)

    })

}