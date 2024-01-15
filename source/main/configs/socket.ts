import { Server } from 'socket.io'
import instance from './instance'
import setEvents from './events'

const server = new Server(instance.server)

server.on('connection', (socket) => {
    setEvents(socket, server)
})

export default server