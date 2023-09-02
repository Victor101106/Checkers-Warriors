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

    findAllMovements() {
        this.socket.emit('find-all-movements')
    }

    movePiece(event) {
        this.socket.emit('move-piece', event)
    }

    joinMatch() {
        this.socket.emit('join-match')
    }

    giveUp() {
        this.socket.emit('give-up')
    }

    eventHandler() {
        this.socket.on('find-all-movements-accepted', (event) => this.events.emit('find-all-movements-accepted', event))
        this.socket.on('find-all-movements-rejected', (event) => this.events.emit('find-all-movements-rejected', event))
        this.socket.on('receive-match-accepted', (event) => this.events.emit('receive-match-accepted', event))
        this.socket.on('receive-match-rejected', (event) => this.events.emit('receive-match-rejected', event))
        this.socket.on('join-match-accepted', (event) => this.events.emit('join-match-accepted', event))
        this.socket.on('join-match-rejected', (event) => this.events.emit('join-match-rejected', event))
        this.socket.on('move-piece-rejected', (event) => this.events.emit('move-piece-rejected', event))
        this.socket.on('give-up-rejected', (event) => this.events.emit('give-up-rejected', event))
        this.socket.on('abandoned-match', (event) => this.events.emit('abandoned-match', event))
        this.socket.on('player-joined', (event) => this.events.emit('player-joined', event))
        this.socket.on('move-piece', (event) => this.events.emit('move-piece', event))
    }

}