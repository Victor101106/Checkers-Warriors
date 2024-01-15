import { receiveMatchSocketHelper } from "../factories/main/events/helpers/receive-match-event-helper-factory"
import { InvalidParameters } from "../../application/errors/invalid-parameters"
import { HttpRequestHeaders } from "../../application/contracts/http-headers"
import { parseCookies } from "../../application/helpers/cookie-helper"
import { Server, Socket } from "socket.io"
import { z } from "zod"

module.exports = (socket: Socket, server: Server) => {

    socket.on('receive-match', async (event) => {

        const eventSchema = z.object({ matchId: z.string() })
        const safeParse = eventSchema.safeParse(event)

        if (!safeParse.success)
            return socket.emit('receive-match-rejected', new InvalidParameters())

        const matchId = safeParse.data.matchId

        const parsedCookie = parseCookies((<HttpRequestHeaders>socket.request.headers).cookie)
        const accessToken = parsedCookie['access-token']

        const responseOrError = await receiveMatchSocketHelper.execute({
            accessToken: accessToken,
            socketId: socket.id,
            matchId: matchId
        })

        if (responseOrError.isLeft())
            return socket.emit('receive-match-rejected', responseOrError.value)

        socket.join(matchId)
        socket.emit('receive-match-accepted', responseOrError.value)

    })

}