import { EventEmitter } from "../event-emitter.js"

export class Socket {

    constructor() {
        this.events = new EventEmitter()
        this.socket = io()
        this.eventHandler()
    }

    receiveMatch(matchId) {
        this.socket.emit('receive-match', { matchId })
    }

    eventHandler() {
        this.socket.on('receive-match-accepted', (event) => this.events.emit('receive-match-accepted', event))
        this.socket.on('receive-match-rejected', (event) => this.events.emit('receive-match-rejected', event))
    }

}