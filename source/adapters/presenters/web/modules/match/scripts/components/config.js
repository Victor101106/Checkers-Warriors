import { EventEmitter } from "../../../../shared/scripts/components/event-emitter.js"
import language from "./langua.js"

export class Config {
    
    // --> Constructor Functions

    constructor(canvas) {
        this.events = new EventEmitter()
        this.canvas = canvas
    }

    // --> Configure Functions

    configureCanvas() {

        const { innerHeight: windowInnerHeight, innerWidth: windowInnerWidth } = window
        
        if (windowInnerWidth / windowInnerHeight < this.container.width / this.container.height) {
            this.canvas.width  = Math.round(this.container.width)
            this.canvas.height = Math.round(windowInnerHeight * this.canvas.width / windowInnerWidth)
        } else {
            this.canvas.height = Math.round(this.container.height)
            this.canvas.width  = Math.round(windowInnerWidth * this.canvas.height / windowInnerHeight)
        }

        this.configurePosition()

    }

    configureContainer(state) {
        this.container = { width:  state.board.columns * 16 + 22, height: state.board.rows * 16 + 30 }
    }

    configurePosition() {
        this.container.top  = Math.floor(this.canvas.height / 2 - this.container.height / 2)
        this.container.left = Math.floor(this.canvas.width / 2 - this.container.width / 2)
        this.events.emit('configure-container', this.container, this.board)
    }

    configureBoard(state) {
        this.board = { height: state.board.rows * 16 + 6, width: state.board.columns * 16, offsetX: 0, offsetY: 0 }
        this.board.top  = this.container.height / 2 - this.board.height / 2
        this.board.left = this.container.width / 2 - this.board.width / 2        
    }

    configureTitle(state) {
        document.title = state.indexOf == -1 ? language.getCaption(1) : language.getCaption(2)
    }

    // --> Final Class

}