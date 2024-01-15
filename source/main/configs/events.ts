import { Server, Socket } from 'socket.io'
import { readdirSync } from 'fs'
import { join } from 'path'

export default (socket: Socket, server: Server): void => {
    readdirSync(join(__dirname, '../events/')).forEach(file => {
        file !== 'helpers' && require(join(__dirname, `../events/${file}`))(socket, server)
    })
}