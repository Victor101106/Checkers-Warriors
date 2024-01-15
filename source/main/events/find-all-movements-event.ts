import { findAllMovementsSocketHelper } from "../factories/main/events/helpers/find-all-movements-event-helper-factory"
import { Server, Socket } from "socket.io"

module.exports = (socket: Socket, server: Server) => {

    socket.on('find-all-movements', async (event) => {

        const responseOrError = await findAllMovementsSocketHelper.execute({ relationId: socket.id })

        if (responseOrError.isLeft())
            return socket.emit('find-all-movements-rejected', responseOrError.value)

        socket.emit('find-all-movements-accepted', responseOrError.value)

    })

}