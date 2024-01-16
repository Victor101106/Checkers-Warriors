import { receiveMatchSocketProcessor } from "../factories/application/processors/receive-match-socket-processor-factory"
import { HttpRequestHeaders } from "../../application/contracts/http-headers"
import { parseCookies } from "../../application/helpers/cookie-helper"
import { Server, Socket } from "socket.io"

module.exports = (socket: Socket, server: Server) => {

    socket.on('receive-match', async (event) => {

        const parsedCookie = parseCookies((<HttpRequestHeaders>socket.request.headers).cookie)
        const accessToken = parsedCookie['access-token']

        const responseOrError = await receiveMatchSocketProcessor.execute({
            accessToken: accessToken,
            socketId: socket.id,
            matchId: event?.matchId
        })

        if (responseOrError.isLeft())
            return socket.emit('receive-match-rejected', responseOrError.value)

        socket.join(event.matchId)
        socket.emit('receive-match-accepted', responseOrError.value)

    })

}