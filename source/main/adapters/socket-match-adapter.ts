import { InvalidParameters } from '../../adapters/controllers/errors/invalid-parameters'
import { HttpRequestHeaders } from '../../adapters/controllers/ports/http-headers'
import { FindAllMovementsSocketHelper } from './helpers/find-all-movements-socket-helper'
import { JoinMatchSocketHelper } from './helpers/join-match-socket-helper'
import { ReceiveMatchSocketHelper } from './helpers/receive-match-socket-helper'
import { Server, Socket } from 'socket.io'
import { z } from 'zod'

export class SocketMatchAdapter {

    private readonly findAllMovementsSocketHelper: FindAllMovementsSocketHelper
    private readonly receiveMatchSocketHelper: ReceiveMatchSocketHelper
    private readonly joinMatchSocketHelper: JoinMatchSocketHelper
    private readonly server: Server

    constructor(findAllMovementsSocketHelper: FindAllMovementsSocketHelper, receiveMatchSocketHelper: ReceiveMatchSocketHelper, joinMatchSocketHelper: JoinMatchSocketHelper, server: Server) {
        this.findAllMovementsSocketHelper = findAllMovementsSocketHelper
        this.receiveMatchSocketHelper = receiveMatchSocketHelper
        this.joinMatchSocketHelper = joinMatchSocketHelper
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

                const responseOrError = await this.receiveMatchSocketHelper.execute({
                    headers: <HttpRequestHeaders>socket.request.headers,
                    socketId: socket.id,
                    matchId: matchId
                })

                if (responseOrError.isLeft())
                    return socket.emit('receive-match-rejected', this.errorToObject(responseOrError.value))

                socket.join(matchId)
                socket.emit('receive-match-accepted', responseOrError.value)

            })

            socket.on('join-match', async (event) => {

                const responseOrError = await this.joinMatchSocketHelper.execute({ relationId: socket.id })

                if (responseOrError.isLeft())
                    return socket.emit('join-match-rejected', this.errorToObject(responseOrError.value))
            
                const { match, player, indexOf } = responseOrError.value

                this.server.to(match.id.value).emit('player-joined', { player })
                socket.emit('join-match-accepted', { indexOf })

            })

            socket.on('find-all-movements', async (event) => {

                const responseOrError = await this.findAllMovementsSocketHelper.execute({ relationId: socket.id })

                if (responseOrError.isLeft())
                    return socket.emit('find-all-movements-rejected', this.errorToObject(responseOrError.value))

                socket.emit('find-all-movements-accepted', responseOrError.value)

            })

        })

    }

    errorToObject(error: Error) {
        return { message: error.message, name: error.name }
    }

}