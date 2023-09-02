import { FindAllMovementsSocketHelper } from './helpers/find-all-movements-socket-helper'
import { InvalidParameters } from '../../adapters/controllers/errors/invalid-parameters'
import { HttpRequestHeaders } from '../../adapters/controllers/ports/http-headers'
import { ReceiveMatchSocketHelper } from './helpers/receive-match-socket-helper'
import { MovePieceSocketHelper } from './helpers/move-piece-socket-helper'
import { JoinMatchSocketHelper } from './helpers/join-match-socket-helper'
import { GiveUpSocketHelper } from './helpers/give-up-socket-helper'
import { Server, Socket } from 'socket.io'
import { z } from 'zod'

export class SocketMatchAdapter {

    private readonly findAllMovementsSocketHelper: FindAllMovementsSocketHelper
    private readonly receiveMatchSocketHelper: ReceiveMatchSocketHelper
    private readonly movePieceSocketHelper: MovePieceSocketHelper
    private readonly joinMatchSocketHelper: JoinMatchSocketHelper
    private readonly giveUpSocketHelper: GiveUpSocketHelper
    private readonly server: Server

    constructor(findAllMovementsSocketHelper: FindAllMovementsSocketHelper, receiveMatchSocketHelper: ReceiveMatchSocketHelper, movePieceSocketHelper: MovePieceSocketHelper, joinMatchSocketHelper: JoinMatchSocketHelper, giveUpSocketHelper: GiveUpSocketHelper, server: Server) {
        this.findAllMovementsSocketHelper = findAllMovementsSocketHelper
        this.receiveMatchSocketHelper = receiveMatchSocketHelper
        this.movePieceSocketHelper = movePieceSocketHelper
        this.joinMatchSocketHelper = joinMatchSocketHelper
        this.giveUpSocketHelper = giveUpSocketHelper
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
            
            socket.on('move-piece', async (event) => {

                const positionSchema = z.object({ column: z.number(), row: z.number() })

                const startsAtSafeParse = positionSchema.safeParse(event.startsAt)
                const endsAtSafeParse = positionSchema.safeParse(event.endsAt)

                if (!startsAtSafeParse.success || !endsAtSafeParse.success)
                    return socket.emit('move-piece-rejected', this.errorToObject(new InvalidParameters()))

                const responseOrError = await this.movePieceSocketHelper.execute({
                    startsAt: startsAtSafeParse.data,
                    endsAt: endsAtSafeParse.data,
                    relationId: socket.id
                })

                if (responseOrError.isLeft())
                    return socket.emit('move-piece-rejected', this.errorToObject(responseOrError.value))

                const response = responseOrError.value

                this.server.to(response.matchId.value).emit('move-piece', {
                    positions: response.positions,
                    promoted: response.promoted,
                    startsAt: response.startsAt,
                    winner: response.winner,
                    endsAt: response.endsAt,
                    jumps: response.jumps
                })

            })

            socket.on('give-up', async (event) => {

                const responseOrError = await this.giveUpSocketHelper.execute({
                    relationId: socket.id
                })

                if (responseOrError.isLeft())
                    return socket.emit('give-up-rejected', this.errorToObject(responseOrError.value))

                const response = responseOrError.value

                this.server.to(response.matchId.value).emit('abandoned-match', {
                    winner: response.winner
                })

            })

        })

    }

    errorToObject(error: Error) {
        return { message: error.message, name: error.name }
    }

}