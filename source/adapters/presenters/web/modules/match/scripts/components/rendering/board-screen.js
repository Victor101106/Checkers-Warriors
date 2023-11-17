import language from "../langua.js"

export class BoardScreen {

    // --> Constructor Function

    constructor(canvas, context, parent) {
        this.context = context
        this.parent = parent
        this.canvas = canvas
    }

    // --> Configure Functions

    configureElements() {

        const optionsButtonCaption = language.getCaption(5)

        this.parent.createElement("options-button", this.parent.board.left, this.parent.board.top + this.parent.board.height + 4, optionsButtonCaption.length * 4 + 5, 5, optionsButtonCaption, (event) => { return this._optionsButtonClickEvent(event) }, this)
        this.parent.createElement("board", this.parent.board.left, this.parent.board.top, this.parent.board.width, this.parent.board.height, undefined, (event) => { return this._boardClickEvent(event) }, this)

    }

    // --> Event Functions

    _boardClickEvent(coordinate) {

        const position = this.coordinateToBoardPosition(coordinate.x, coordinate.y)
        const rotatedPosition = this.parent.rotatePosition(position)

        const positionAlreadySelected = this.selection && this.selection.column == rotatedPosition.column && this.selection.row == rotatedPosition.row
        const positionOutsideBoard = position.column < 0 || position.row < 0 || position.column >= this.parent.state.board.columns || position.row >= this.parent.state.board.rows

        if (positionOutsideBoard || positionAlreadySelected)
            return this.selection = undefined

        if (this.selection && this.movements.find(({ startsAt, endsAt }) => startsAt.column == this.selection.column && startsAt.row == this.selection.row && endsAt.column == rotatedPosition.column && endsAt.row == rotatedPosition.row))
            return this.parent.events.emit('request-move-piece', { startsAt: this.selection, endsAt: rotatedPosition }) || true

        if (!this.movements || !this.movements.find(({ startsAt }) => startsAt.column == rotatedPosition.column && startsAt.row == rotatedPosition.row))
            return this.selection = undefined

        this.selection = rotatedPosition

    }

    _movePieceEvent({ startsAt, endsAt, jumps, promoted, winner }) {

        const pieceOrUndefined = this.parent.state.board.spots[startsAt.row][startsAt.column]

        this.parent.state.board.spots[startsAt.row][startsAt.column] = undefined
        this.parent.state.board.spots[endsAt.row][endsAt.column] = pieceOrUndefined
        
        for (let jump of jumps) {
            this.parent.state.board.spots[jump.position.row][jump.position.column] = undefined
            this.parent.state.score[jump.piece.player ? 0 : 1]++
        }

        pieceOrUndefined.promoted = pieceOrUndefined.promoted || promoted
        
        this.selection = undefined
        this.movements = undefined

        if (!this.parent.screens.optionsScreen.options.enableSounds)
            return

        if (promoted)
            this.parent.sounds.promotionSound.play()
        else
            this.parent.sounds.movePieceSound.play()

        if (winner)
            this.parent.configureWinner(pieceOrUndefined.player)

    }

    _optionsButtonClickEvent(coordinate) {
        this.parent.currentScreen = this.parent.screens.optionsScreen
    }

    // --> Auxiliary Functions

    coordinateToBoardPosition(x, y) {
        return {
            column: Math.floor((x - this.parent.container.left - this.parent.board.left) / 16),
            row: Math.floor((y - this.parent.container.top - this.parent.board.top) / 16)
        }
    }

    // --> Rendering Function

    render(deltatime) {
        this._renderOutline()
        this._renderSpots()
        this._renderSelections()
        this._renderPieces()
        this._renderPlayerUp()
        this._renderTimer()
        this._renderScore()
        this._renderOptionsButton()
        this._renderPlayerDown()
    }

    // --> Board Render Functions

    _renderOutline() {
        this.context.fillStyle = '#071916'
        this.context.fillRect(this.parent.board.left - 1, this.parent.board.top - 1, this.parent.board.width + 2, this.parent.board.height + 2)
    }

    _renderSpots() {
        for (let row = 0; row < this.parent.state.board.rows + 1; row++) {
            for (let column = 0; column < this.parent.state.board.columns; column++) {
                this._renderSpot(column, row)
            }
        }
    }
    
    _renderSpot(column, row) {

        const isLastSpot = row == this.parent.state.board.rows
        const palettes = isLastSpot ? ['#dfeae2', '#207567'] : ['#f8fffa', '#8dc3a7']

        this.context.fillStyle = (column + row) % 2 == (isLastSpot ? 1 : 0) ? palettes[0] : palettes[1]
        this.context.fillRect(this.parent.board.left + 16 * column, this.parent.board.top + 16 * row, 16, isLastSpot ? 6 : 16)

    }

    _renderPieces() {
        for (let row = 0; row < this.parent.state.board.rows; row++) {
            for (let column = 0; column < this.parent.state.board.columns; column++) {
                const piece = this.parent.state.board.spots[row][column]
                if (piece) this._renderPiece(column, row, piece)
            }
        }
    }

    _renderPiece(column, row, piece) {

        const image = piece.player ? this.parent.images.pieceBlack : this.parent.images.pieceWhite
        const position = this.parent.rotatePosition({ column, row })

        this.context.drawImage(image, Math.round(this.parent.board.left + position.column * 16 + 2), Math.round(this.parent.board.top + position.row * 16 + 2))

        if (piece.promoted) this._renderCrown(position.column, position.row)

    }

    _renderCrown(column, row) {
        this.context.drawImage(this.parent.images.pieceCrown, this.parent.board.left + column * 16 + 3, this.parent.board.top + row * 16 - 2)
    }

    _renderSelections() {
        
        if (!this.selection)
            return this.movements?.forEach(movement => this._renderSelection(movement.startsAt.column, movement.startsAt.row))    
        
        const movementFilter = (movement) => movement.startsAt.column == this.selection.column && movement.startsAt.row == this.selection.row
        const movements = this.movements.filter(movementFilter)

        movements.length && this._renderSelection(this.selection.column, this.selection.row)

        for (let movement of movements) {
            for (let position of movement.positions) {
                this._renderSelection(position.column, position.row)
            }
            for (let jump of movement.jumps) {
                this._renderSelection(jump.position.column, jump.position.row)
            }
        }

    }

    _renderSelection(column, row) {

        const position = this.parent.rotatePosition({ column, row })

        const pieceOrUndefined = this.parent.state.board.spots[row][column]
        const image = this.parent.images[pieceOrUndefined ? (pieceOrUndefined.player == this.parent.state.indexOf ? "selectionPiece" : "selectionJump") : "selectionSpot"]

        this.context.drawImage(image, this.parent.board.left + position.column * 16, this.parent.board.top + position.row * 16)

    }

    // --> Extra-Board Render Functions

    _renderPlayerUp() {
        
        const players = this.parent.rotatePlayers().map(player => player || '???')
        const characters = this.parent.images.charactersGreen

        const [ left, top ] = [ this.parent.board.left, 2 ]
        
        if (this.parent.rotateTurn() == 0)
            this.context.drawImage(this.parent.images.indicatorLeft, left + 10 + Math.min(players[0].length, 14) * 4, top + 1)
        else
            this.context.globalAlpha = 0.60  

        this.context.drawImage(this.parent.images.profilePicture, left, top)

        this.parent._renderString(players[0], left + 9, top + 1, characters, 14)

        this.context.globalAlpha = 1.00
        
    }

    _renderTimer() {
        
        const difference = (new Date().getTime() - new Date(this.parent.state.createdAt).getTime()) / 1000
        const minutes = String(Math.floor(difference / 60))
        const seconds = String(Math.floor(difference - minutes * 60))
        
        const [ left, top ] = [ this.parent.board.left + this.parent.board.width, 3 ]

        const characters = this.parent.images.charactersGreen

        this.context.globalAlpha = 0.60

        this.parent._renderString(seconds.length == 1 ? '0'.concat(seconds) : seconds, left - 7, top, characters, 2)
        
        this.context.drawImage(this.parent.images.characterColon, left - 10, top)
        
        this.parent._renderString(minutes.length == 1 ? '0'.concat(minutes) : minutes, left - 17, top, characters, 2)

        this.context.globalAlpha = 1.00

    }

    _renderScore() {

        const top  = this.parent.board.top + Math.floor((this.parent.board.height - 6) / 2 - 7)
        const left = this.parent.board.left - 3
        
        const characters = this.parent.images.charactersGreen
        const score = this.parent.rotateScore()

        this.context.globalAlpha = 0.60

        this.parent._renderString(String(score[0]).split('').reverse().join(''), left - 3, top, characters, Infinity, -1)
        
        this.context.drawImage(this.parent.images.characterCross, left - 3, top + 6)
        
        this.parent._renderString(String(score[1]).split('').reverse().join(''), left - 3, top + 10, characters, Infinity, -1)

        this.context.globalAlpha = 1.00

    }

    _renderOptionsButton() {
        
        const optionsButton = this.parent.getElement('options-button')
        const characters = this.parent.images.charactersGreen
        
        if (!optionsButton.hovering)
            this.context.globalAlpha = 0.60
        
        this.context.drawImage(this.parent.images.characterLines, optionsButton.left, optionsButton.top)
        
        this.parent._renderString(optionsButton.caption, optionsButton.left + 6, optionsButton.top, characters)

        this.context.globalAlpha = 1.00

    }

    _renderPlayerDown() {

        const players = this.parent.rotatePlayers().map(player => player || '???')
        const characters = this.parent.images.charactersGreen

        const left = this.parent.board.left + this.parent.board.width - 7
        const top = this.parent.board.top + this.parent.board.height + 3

        if (this.parent.rotateTurn() == 1)
            this.context.drawImage(this.parent.images.indicatorRight, left - players[1].length * 4 - 11, top + 1)
        else
            this.context.globalAlpha = 0.60

        this.context.drawImage(this.parent.images.profilePicture, left, top)
        
        this.parent._renderString(players[1].split('').reverse().join(''), left - 5, top + 1, characters, 14, -1)

        this.context.globalAlpha = 1.00

    }

    // --> Final Class

}