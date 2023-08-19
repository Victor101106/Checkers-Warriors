import { EventEmitter } from "../event-emitter.js"

export class Render {
 
    // <-- Constructor Function --> //

    constructor(canvas, context) {
        this.events = new EventEmitter()
        this.effect = { offsetY: 0 }
        this.context = context
        this.canvas = canvas
    }

    // <-- Configure Functions --> //

    configureContainer(container) {
        this.container = container
        this.configureTranslate()
        this.configureBoard()
    }
    
    configureTranslate() {
        this.context.reset()
        this.context.translate(this.container.left, this.container.top)
    }

    configureBoard() {
        if (this.state && this.container) {
            this.board = { height: this.state.board.rows * 16 + 6, width: this.state.board.columns * 16 }
            this.board.top = this.container.height / 2 - this.board.height / 2
            this.board.left = this.container.width / 2 - this.board.width / 2
        }
    }
    
    configureState(state) {
        this.state = state
        this.configureBoard()
    }
    
    configureEffect() {
        this.effect.interval = setInterval(() => this.effect.offsetY = this.effect.offsetY ? 0 : 1, 125)
    }

    // <-- Draw Functions --> //

    beginRendering() {
        
        this.deltatime = (new Date().getTime() - this.deltatime0) / 1000 || 0
        this.deltatime0 = new Date().getTime()

        this.drawBackground()

        if (this.effect.interval) 
            this.drawEffect()
        
        requestAnimationFrame(() => this.beginRendering())

    }

    drawBackground() {
        this.context.fillStyle = '#0d302a'
        this.context.fillRect(0 - this.container?.left, 0 - this.container?.top, this.canvas.width, this.canvas.height)
    }

    drawEffect() {
        this.context.fillStyle = '#000000'
        this.context.globalAlpha = 0.1
        for (let y = this.effect.offsetY; y < this.canvas.height; y += 2) {
            this.context.fillRect(0 - this.container?.left, y - this.container?.top, this.canvas.width, 1)
        }
        this.context.globalAlpha = 1.0
    }

    // <-- Final Class --> //

}