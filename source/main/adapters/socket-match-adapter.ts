import { InvalidParameters } from '../../adapters/controllers/errors/invalid-parameters'
import { HttpRequestHeaders } from '../../adapters/controllers/ports/http-headers'
import { ReceiveMatchSocketHelper } from './helpers/receive-match-socket-helper'
import { Server, Socket } from 'socket.io'
import { z } from 'zod'

export class SocketMatchAdapter {

    private readonly receiveMatchSocketAdapter: ReceiveMatchSocketHelper
    private readonly server: Server

    constructor(receiveMatchSocketAdapter: ReceiveMatchSocketHelper, server: Server) {
        this.receiveMatchSocketAdapter = receiveMatchSocketAdapter
        this.server = server
        this.eventHandler()
    }

    eventHandler() {
        
        this.server.on('connection', (socket: Socket) => {
        
            socket.on('receive-match', async (event) => {

                const eventSchema = z.object({ matchId: z.string() })
                const safeParse = eventSchema.safeParse(event)

                if (!safeParse.success)
                    return socket.emit('receive-match-rejected', this.errorToObject(new InvalidParameters()))

                const matchId = safeParse.data.matchId

                const responseOrError = await this.receiveMatchSocketAdapter.execute({
                    headers: <HttpRequestHeaders>socket.request.headers,
                    socketId: socket.id,
                    matchId: matchId
                })

                if (responseOrError.isLeft())
                    return socket.emit('receive-match-rejected', this.errorToObject(responseOrError.value))

                socket.join(matchId)
                socket.emit('receive-match-accepted', responseOrError.value)

            })

        })

    }

    errorToObject(error: Error) {
        return { message: error.message, name: error.name }
    }

}