import { EventEmitter } from "../event-emitter.js"

export class Config {
    
    constructor(canvas) {
        this.events = new EventEmitter()
        this.canvas = canvas
    }

    configureCanvas() {
        if (window.innerWidth < window.innerHeight) {
            this.canvas.width  = Math.round(this.container.width)
            this.canvas.height = Math.round(window.innerHeight * this.canvas.width / window.innerWidth)
            this.configurePosition()
        } else {
            this.canvas.height = Math.round(this.container.height)
            this.canvas.width  = Math.round(window.innerWidth * this.canvas.height / window.innerHeight)
            this.configurePosition()
        }
    }
    
    configureContainer(state) {
        this.container = { height: state.board.rows * 16 + 30, width: state.board.columns * 16 + 22 }
        this.configurePosition()
    }

    configurePosition() {
        this.container.top = Math.floor(this.canvas.height / 2 - this.container.height / 2)
        this.container.left = Math.floor(this.canvas.width / 2 - this.container.width / 2)
        this.events.emit('updated-container', this.container)
    }

    configureTitle(state) {
        document.title = `${ state.indexOf != 1 ? 'Playing' : 'Watching' } Match • Checkers Warriors` 
    }

}