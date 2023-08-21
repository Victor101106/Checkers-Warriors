import { EventEmitter } from "../event-emitter.js"
import { loadImage } from "../load-image.js"

export class Render {
 
    // <-- Constructor Function --> //

    constructor(canvas, context) {
        this.events = new EventEmitter()
        this.effect = { offsetY: 0 }
        this.context = context
        this.canvas = canvas
    }

    // <-- Configure Functions --> //

    async configureImages() {
        this.images = {
            'piece-crown': await loadImage('../static/assets/game/piece-crown.png'),
            'piece-white': await loadImage('../static/assets/game/piece-white.png'),
            'piece-black': await loadImage('../static/assets/game/piece-black.png'),
        }
    }

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

    // <-- Utility Functions --> //

    rotatePosition(position) {   
        return { 
            column: this.state.indexOf != 0 ? position.column : this.state.board.columns - position.column - 1,
            row: this.state.indexOf != 0 ? position.row : this.state.board.rows - position.row - 1
        }
    }

    // <-- Draw Functions --> //

    beginRendering() {
        
        this.deltatime = (new Date().getTime() - this.deltatime0) / 1000 || 0
        this.deltatime0 = new Date().getTime()

        this.drawBackground()

        if (this.state)
            this.drawBoard()

        if (this.effect.interval) 
            this.drawEffect()
        
        requestAnimationFrame(() => this.beginRendering())

    }

    drawBackground() {
        this.context.fillStyle = '#0d302a'
        this.context.fillRect(0 - this.container?.left, 0 - this.container?.top, this.canvas.width, this.canvas.height)
    }

    drawBoard() {
        this.drawOutline()
        this.drawSpots()
        this.drawPieces()
    }
    
    drawOutline() {
        this.context.fillStyle = '#071916'
        this.context.fillRect(this.board.left - 1, this.board.top - 1, this.board.width + 2, this.board.height + 2)
    }

    drawSpots() {
        for (let row = 0; row < this.state.board.rows + 1; row++) {
            for (let column = 0; column < this.state.board.columns; column++) {
                this.drawSpot({ column, row })
            }
        }
    }
    
    drawSpot(position) {

        const isLastSpot = position.row == this.state.board.rows
        const palettes = isLastSpot ? ['#dfeae2', '#207567'] : ['#f8fffa', '#8dc3a7']

        this.context.fillStyle = (position.column + position.row) % 2 == (isLastSpot ? 1 : 0) ? palettes[0] : palettes[1]
        this.context.fillRect(this.board.left + 16 * position.column, this.board.top + 16 * position.row, 16, isLastSpot ? 6 : 16)

    }

    drawPieces() {
        for (let row = 0; row < this.state.board.rows; row++) {
            for (let column = 0; column < this.state.board.columns; column++) {
                const piece = this.state.board.spots[row][column]
                if (piece) this.drawPiece({ column, row }, piece)
            }
        }
    }

    drawPiece(position, piece) {

        const image = piece.player ? this.images['piece-black'] : this.images['piece-white']
        const rotated = this.rotatePosition(position)

        this.context.drawImage(image, this.board.left + rotated.column * 16 + 2, this.board.top + rotated.row * 16 + 2)

        if (piece.promoted) this.drawCrown(rotated)

    }
    
    drawCrown(position) {
        this.context.drawImage(this.images['piece-crown'], this.board.left + position.column * 16 + 3, this.board.top + position.row * 16 - 2)
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