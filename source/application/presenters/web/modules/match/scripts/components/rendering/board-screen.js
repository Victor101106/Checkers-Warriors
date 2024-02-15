import { RenderBoard } from "../../../../../@shared/scripts/components/rendering/render-board.js"

export class BoardScreen {

    // --> Constructor Function

    constructor(canvas, context, parent) {
        this.renderBoard = new RenderBoard(canvas, context, parent.images, parent.sounds, parent.screens.optionsScreen.options)
        this.moveIndicators = new Array()
        this.jumpIndicators = new Array()
        this.particles = new Array()
        this.context = context
        this.parent = parent
        this.canvas = canvas
    }

    // --> Configure Functions

    configureElements() {

        const optionsButtonCaption = this.parent.screens.optionsScreen.language.getCaption('options')

        const boardElement = this.renderBoard.calculateElement(this.parent.state, {
            left: this.parent.board.left - 1,
            top: this.parent.board.top -  1
        })

        this.renderBoard.events.on('request-move-piece', (event) => {
            this.parent.events.emit('request-move-piece', event)
        })

        this.renderBoard.events.on('request-all-movements', (event) => {
            this.parent.events.emit('request-find-all-movements', event)
        })

        this.renderBoard.events.on('winner', (position) => {
            
            const pieceOrUndefined = this.parent.state.board.spots[position.row][position.column]

            this.parent.configureWinner(pieceOrUndefined.player)

        })

        this.parent.createElement("options-button", this.parent.board.left, this.parent.board.top + this.parent.board.height + 4, optionsButtonCaption.length * 4 + 5, 5, optionsButtonCaption, (event) => { return this._optionsButtonClickEvent(event) }, this)
        this.parent.createElement("board", boardElement.left, boardElement.top, boardElement.width, boardElement.height, undefined, (event) => { return this._boardClickEvent(event) }, this)

    }

    // --> Event Functions

    _boardClickEvent(coordinate) {

        this.renderBoard.calculateSelection({
            x: coordinate.x - this.parent.container.left,
            y: coordinate.y - this.parent.container.top
        })

    }

    _movePieceEvent(events) {
        this.renderBoard.calculateMovement(events)
    }

    _optionsButtonClickEvent(coordinate) {
        this.parent.currentScreen = this.parent.screens.optionsScreen
    }

    // --> Rendering Function

    render(deltatime) {

        this._renderPlayerUp()
        this._renderTimer()
        this._renderScore()
        this._renderOptionsButton()
        this._renderPlayerDown()

        this.renderBoard.render(this.parent.state, {
            left: this.parent.board.left - 1,
            top: this.parent.board.top -  1
        }, this.parent.deltatime)

    }

    // --> Extra-Board Render Functions

    _renderPlayerUp() {
        
        const players = this.parent.rotatePlayers().map(player => player || '???')
        const characters = this.parent.images['characters-green']

        const [ left, top ] = [ this.parent.board.left, 2 ]
        
        if (this.parent.rotateTurn() == 0)
            this.context.drawImage(this.parent.images['indicator-left'], left + 10 + Math.min(players[0].length, 14) * 4, top + 1)
        else
            this.context.globalAlpha = 0.60  

        this.context.drawImage(this.parent.images['profile-picture'], left, top)

        this.parent._renderString(players[0], left + 9, top + 1, characters, 14)

        this.context.globalAlpha = 1.00
        
    }

    _renderTimer() {
        
        const difference = (new Date().getTime() - new Date(this.parent.state.createdAt).getTime()) / 1000
        const minutes = String(Math.floor(difference / 60))
        const seconds = String(Math.floor(difference - minutes * 60))
        
        const [ left, top ] = [ this.parent.board.left + this.parent.board.width, 3 ]

        const characters = this.parent.images['characters-green']

        this.context.globalAlpha = 0.60

        this.parent._renderString(seconds.length == 1 ? '0'.concat(seconds) : seconds, left - 7, top, characters, 2)
        
        this.context.drawImage(this.parent.images['character-colon'], left - 10, top)
        
        this.parent._renderString(minutes.length == 1 ? '0'.concat(minutes) : minutes, left - 17, top, characters, 2)

        this.context.globalAlpha = 1.00

    }

    _renderScore() {

        const top  = this.parent.board.top + Math.floor((this.parent.board.height - 6) / 2 - 7)
        const left = this.parent.board.left - 3
        
        const characters = this.parent.images['characters-green']
        const score = this.parent.rotateScore()

        this.context.globalAlpha = 0.60

        this.parent._renderString(String(score[0]).split('').reverse().join(''), left - 3, top, characters, Infinity, -1)
        
        this.context.drawImage(this.parent.images['character-cross'], left - 3, top + 6)
        
        this.parent._renderString(String(score[1]).split('').reverse().join(''), left - 3, top + 10, characters, Infinity, -1)

        this.context.globalAlpha = 1.00

    }

    _renderOptionsButton() {
        
        const optionsButton = this.parent.getElement('options-button')
        const characters = this.parent.images['characters-green']
        
        if (!optionsButton.hovering)
            this.context.globalAlpha = 0.60
        
        this.context.drawImage(this.parent.images['character-lines'], optionsButton.left, optionsButton.top)
        
        this.parent._renderString(optionsButton.caption, optionsButton.left + 6, optionsButton.top, characters)

        this.context.globalAlpha = 1.00

    }

    _renderPlayerDown() {

        const players = this.parent.rotatePlayers().map(player => player || '???')
        const characters = this.parent.images['characters-green']

        const left = this.parent.board.left + this.parent.board.width - 7
        const top = this.parent.board.top + this.parent.board.height + 3

        if (this.parent.rotateTurn() == 1)
            this.context.drawImage(this.parent.images['indicator-right'], left - players[1].length * 4 - 11, top + 1)
        else
            this.context.globalAlpha = 0.60

        this.context.drawImage(this.parent.images['profile-picture'], left, top)
        
        this.parent._renderString(players[1].split('').reverse().join(''), left - 5, top + 1, characters, 14, -1)

        this.context.globalAlpha = 1.00

    }

    // --> Final Class

}