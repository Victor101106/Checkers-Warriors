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
            'character-cross': await loadImage('../static/assets/game/character-cross.png'),
            'character-colon': await loadImage('../static/assets/game/character-colon.png'),
            'character-lines': await loadImage('../static/assets/game/character-lines.png'),
            'profile-picture': await loadImage('../static/assets/game/profile-picture.png'),
            'piece-crown': await loadImage('../static/assets/game/piece-crown.png'),
            'piece-white': await loadImage('../static/assets/game/piece-white.png'),
            'piece-black': await loadImage('../static/assets/game/piece-black.png'),
            'arrow-right': await loadImage('../static/assets/game/arrow-right.png'),
            'arrow-left': await loadImage('../static/assets/game/arrow-left.png'),
            'alphabet': await loadImage('../static/assets/game/alphabet.png'),
            'numerals': await loadImage('../static/assets/game/numerals.png'),
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
            this.events.emit('updated-board', this.board)
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

    rotatePlayers() {
        return this.state.indexOf != 0 ? this.state.players : [...this.state.players].reverse()
    }
    
    rotateScore() {
        return this.state.indexOf != 0 ? this.state.score : [...this.state.score].reverse()
    }

    rotateTurn() {
        return this.state.indexOf != 0 ? this.state.turn : 1 - this.state.turn
    }

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

        if (this.state) {
            this.drawExtraBoard()
            this.drawBoard()
        }

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
    
    drawExtraBoard() {
        this.drawOptionsButton()
        this.drawPlayerDown()
        this.drawPlayerUp()
        this.drawScore()
        this.drawTimer()
    }
    
    drawPlayerDown() {

        const players = this.rotatePlayers().map(player => player || '???')
        const left = this.board.left + this.board.width - 7
        const top = this.board.top + this.board.height + 3

        if (this.rotateTurn() == 1)
            this.context.drawImage(this.images['arrow-right'], left - players[1].length * 4 - 11, top + 1)
        else
            this.context.globalAlpha = 0.60

        this.context.drawImage(this.images['profile-picture'], left, top)
        
        this.drawString(players[1].split('').reverse().join(''), left - 5, top + 1, 14, -1)

        this.context.globalAlpha = 1.00

    }

    drawPlayerUp() {
        
        const players = this.rotatePlayers().map(player => player || '???')
        const [ left, top ] = [ this.board.left, 2 ]
        
        if (this.rotateTurn() == 0)
            this.context.drawImage(this.images['arrow-left'], left + 10 + Math.min(players[0].length, 14) * 4, top + 1)
        else
            this.context.globalAlpha = 0.60  

        this.context.drawImage(this.images['profile-picture'], left, top)

        this.drawString(players[0], left + 9, top + 1, 14)

        this.context.globalAlpha = 1.00
        
    }
    
    drawOptionsButton() {
        
        const [ left, top ] = [ this.board.left, this.board.top + this.board.height + 4 ]
        
        this.context.globalAlpha = 0.60
        
        this.context.drawImage(this.images["character-lines"], left, top)
        
        this.drawString('Options', left + 6, top)

        this.context.globalAlpha = 1.00

    }

    drawTimer() {
        
        const difference = (new Date().getTime() - this.state.createdAt) / 1000
        const minutes = String(Math.floor(difference / 60))
        const seconds = String(Math.floor(difference - minutes * 60))

        const [ left, top ] = [ this.board.left + this.board.width, 3 ]

        this.context.globalAlpha = 0.60

        this.drawString(seconds.length == 1 ? '0'.concat(seconds) : seconds, left - 7, top, 2)
        
        this.context.drawImage(this.images['character-colon'], left - 10, top)
        
        this.drawString(minutes.length == 1 ? '0'.concat(minutes) : minutes, left - 17, top, 2)

        this.context.globalAlpha = 1.00

    }   

    drawScore() {

        const [ left, top ] = [ this.board.left - 3, this.board.top + Math.floor((this.board.height - 6) / 2 - 7) ]
        const score = this.rotateScore()

        this.context.globalAlpha = 0.60

        this.drawString(String(score[0]).split('').reverse().join(''), left - 3, top, Infinity, -1)
        
        this.context.drawImage(this.images['character-cross'], left - 3, top + 6)
        
        this.drawString(String(score[1]).split('').reverse().join(''), left - 3, top + 10, Infinity, -1)

        this.context.globalAlpha = 1.00

    }

    drawString(string, left, top, length = Infinity, increment = 1) {
                
        const { alphabet, numerals } = this.images

        for (let character of string.toLowerCase()) {
            
            if (length == 0)
                return

            const charCode  = character.charCodeAt(0) - 97
            const charIndex = charCode < 0 || charCode > 25 ? 26 : charCode
    
            const numCode  = character.charCodeAt(0) - 48
            const numIndex = numCode < 0 || numCode > 9 ? 10 : numCode

            if (character != ' ')
                this.context.drawImage(numIndex != 10 ? numerals : alphabet, (numIndex != 10 ? numIndex : charIndex) * 3, 0, 3, 5, left, top, 3, 5)
            
            left   += 4 * increment
            length -= 1

        }

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