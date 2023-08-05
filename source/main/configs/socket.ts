import { Server } from 'socket.io'
import instance from './instance'

export default new Server(instance.server)