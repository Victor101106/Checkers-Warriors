import { EventEmitter } from "../event-emitter.js"
import { loadImage } from "../load-image.js"

export class Render {
 
    // <-- Constructor Function --> //

    constructor(canvas, context) {
        this.events = new EventEmitter()
        this.elements = new Object()
        this.effect = { offsetY: 0 }
        this.showOptions = false
        this.showInvite = false
        this.options = {
            enableAnimations: true,
            enableRotation: true,
            enableEffects: true
        }
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
            'selection-piece': await loadImage('../static/assets/game/selection-piece.png'),
            'selection-jump': await loadImage('../static/assets/game/selection-jump.png'),
            'selection-spot': await loadImage('../static/assets/game/selection-spot.png'),
            'piece-crown': await loadImage('../static/assets/game/piece-crown.png'),
            'piece-white': await loadImage('../static/assets/game/piece-white.png'),
            'piece-black': await loadImage('../static/assets/game/piece-black.png'),
            'arrow-right': await loadImage('../static/assets/game/arrow-right.png'),
            'arrow-left': await loadImage('../static/assets/game/arrow-left.png'),
            'toggle-off': await loadImage('../static/assets/game/toggle-off.png'),
            'toggle-on': await loadImage('../static/assets/game/toggle-on.png'),
            'separator': await loadImage('../static/assets/game/separator.png'),
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

    configureInviteMenu() {

        const [ AcceptInviteValue, JustWatchValue ] = [ 'Accept Invite', 'Just Watch' ]

        const InviteMenuElements = {
            AcceptInviteButton: {
                onclick: () => { if (this.showInvite) this.events.emit('request-join-match') },
                width: AcceptInviteValue.length * 4 - 1,
                value: AcceptInviteValue,
                height: 5,
                left: 0,
                top: 0,
            },
            JustWatchButton: {
                onclick: () => this.showInvite = false,
                width: JustWatchValue.length * 4 - 1,
                value: JustWatchValue,
                height: 5,
                left: 0,
                top: 0,
            }
        }

        this.showInvite = this.state.indexOf == -1 && !this.state.players[1]

        Object.assign(this.elements, InviteMenuElements)

    }

    configureOptionsMenu() {

        const [ EnableAnimationsValue, EnableRotationValue, EnableEffectsValue, OptionsButtonValue, GiveUpValue, CloseValue ] = [ 'Enable Animations', 'Enable Rotation', 'Enable Effects', 'Options', 'Give Up', 'Close' ]
        
        const middleX = (EnableAnimationsValue.length * 4 + 6) / 2

        const translateX = this.container.width / 2 - middleX | 0
        const translateY = this.container.height / 2 - 38 / 2 | 0

        const OptionsMenuElements = {
            OptionsButton: {
                top: this.board.top + this.board.height + 4,
                width: OptionsButtonValue.length * 4 + 5,
                onclick: () => this.showOptions = true,
                value: OptionsButtonValue,
                left: this.board.left,
                height: 5,
            },
            EnableAnimationsToggle: {
                onclick: () => { if (this.showOptions) this.options.enableAnimations = !this.options.enableAnimations },
                width: EnableAnimationsValue.length * 4 + 6,
                value: EnableAnimationsValue,
                left: translateX,
                top: translateY,
                height: 5
            },
            EnableRotationToggle: {
                onclick: () => { if (this.showOptions) this.options.enableRotation = !this.options.enableRotation },
                left: translateX + middleX - (EnableRotationValue.length * 4 + 6) / 2 | 0,
                width: EnableRotationValue.length * 4 + 6,
                value: EnableRotationValue,
                top: translateY + 1 * 7,
                height: 5
            },
            EnableEffectsToggle: {
                onclick: () => { if (this.showOptions) this.options.enableEffects = !this.options.enableEffects },
                left: translateX + middleX - (EnableEffectsValue.length * 4 + 6) / 2 | 0,
                width: EnableEffectsValue.length * 4 + 6,
                value: EnableEffectsValue,
                top: translateY + 2 * 7,
                height: 5
            },
            GiveUpToggle: {
                onclick: () => { if (this.showOptions) this.events.emit('request-give-up') },
                left: translateX + middleX - (GiveUpValue.length * 4 - 1) / 2 | 0,
                width: GiveUpValue.length * 4 - 1,
                top: translateY + 5 + 3 * 7,
                value: GiveUpValue,
                height: 5
            },
            CloseToggle: {
                onclick: () => { if (this.showOptions) this.showOptions = false },
                left: translateX + middleX - (CloseValue.length * 4 - 1) / 2 | 0,
                width: CloseValue.length * 4 - 1,
                top: translateY + 5 + 4 * 7,
                value: CloseValue,
                height: 5
            }
        }

        Object.assign(this.elements, OptionsMenuElements)

    }

    // <-- Utility Functions --> //

    rotatePlayers() {
        return this.state.indexOf == 0 && this.options.enableRotation ? [...this.state.players].reverse() : this.state.players
    }
    
    rotateScore() {
        return this.state.indexOf == 0 && this.options.enableRotation ? [...this.state.score].reverse() : this.state.score
    }

    rotateTurn() {
        return this.state.indexOf == 0 && this.options.enableRotation ? 1 - this.state.turn : this.state.turn
    }

    rotatePosition(position) {   
        return { 
            column: this.state.indexOf == 0 && this.options.enableRotation ? this.state.board.columns - position.column - 1  : position.column,
            row: this.state.indexOf == 0 && this.options.enableRotation ? this.state.board.rows - position.row - 1 : position.row
        }
    }

    reverseTurn() {
        this.state.turn = this.state.turn == 0 ? 1 : 0
    }

    // <-- Event Functions --> //

    selectSpot(position) {

        if (this.showOptions)
            return

        const rotatedPosition = this.rotatePosition(position)

        const positionAlreadySelected = this.selection && this.selection.column == rotatedPosition.column && this.selection.row == rotatedPosition.row
        const positionOutsideBoard = position.column < 0 || position.row < 0 || position.column >= this.state.board.columns || position.row >= this.state.board.rows

        if (positionOutsideBoard || positionAlreadySelected)
            return this.selection = undefined

        if (this.selection && this.movements.find(({ startsAt, endsAt }) => startsAt.column == this.selection.column && startsAt.row == this.selection.row && endsAt.column == rotatedPosition.column && endsAt.row == rotatedPosition.row))
            return this.events.emit('request-move-piece', { startsAt: this.selection, endsAt: rotatedPosition })

        if (!this.movements || !this.movements.find(({ startsAt }) => startsAt.column == rotatedPosition.column && startsAt.row == rotatedPosition.row))
            return this.selection = undefined

        this.selection = rotatedPosition

    }

    // <-- Board Functions --> //

    movePiece({ startsAt, endsAt, jumps, promoted }) {

        const piece = this.state.board.spots[startsAt.row][startsAt.column]
    
        this.state.board.spots[startsAt.row][startsAt.column] = undefined
        this.state.board.spots[endsAt.row][endsAt.column] = piece
        
        for (let jump of jumps)
            this.state.board.spots[jump.position.row][jump.position.column] = undefined

        this.state.score[this.state.turn] += jumps.length
        piece.promoted ||= promoted

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

        if (this.showOptions) {
            this.drawTransparentFilter()
            this.drawOptions()
        }

        if (this.showInvite) {
            this.drawTransparentFilter()
            this.drawInviteMenu()
        }

        if (this.options.enableEffects) 
            this.drawEffect()
        
        requestAnimationFrame(() => this.beginRendering())

    }

    drawBackground() {
        this.context.fillStyle = '#0d302a'
        this.context.fillRect(0 - this.container?.left, 0 - this.container?.top, this.canvas.width, this.canvas.height)
    }

    drawTransparentFilter() {
        this.context.fillStyle = '#0d302a'
        this.context.globalAlpha = 0.95
        this.context.fillRect(0 - this.container?.left, 0 - this.container?.top, this.canvas.width, this.canvas.height)
        this.context.globalAlpha = 1.00
    }

    drawOptions() {
        
        const { EnableAnimationsToggle, EnableRotationToggle, EnableEffectsToggle, GiveUpToggle, CloseToggle } = this.elements

        this.context.globalAlpha = EnableAnimationsToggle.selected ? 1.00 : 0.60
        this.context.drawImage(this.images[this.options.enableAnimations ? "toggle-on" : "toggle-off"], EnableAnimationsToggle.left, EnableAnimationsToggle.top)
        this.drawString(EnableAnimationsToggle.value, 7 + EnableAnimationsToggle.left, EnableAnimationsToggle.top)
        
        this.context.globalAlpha = EnableRotationToggle.selected ? 1.00 : 0.60
        this.context.drawImage(this.images[this.options.enableRotation ? "toggle-on" : "toggle-off"], EnableRotationToggle.left, EnableRotationToggle.top)
        this.drawString(EnableRotationToggle.value, 7 + EnableRotationToggle.left, EnableRotationToggle.top)

        this.context.globalAlpha = EnableEffectsToggle.selected ? 1.00 : 0.60
        this.context.drawImage(this.images[this.options.enableEffects ? "toggle-on" : "toggle-off"], EnableEffectsToggle.left, EnableEffectsToggle.top)
        this.drawString(EnableEffectsToggle.value, 7 + EnableEffectsToggle.left, EnableEffectsToggle.top)
        
        this.context.globalAlpha = 0.60
        this.context.drawImage(this.images.separator, EnableAnimationsToggle.left + EnableAnimationsToggle.width / 2 - 17 / 2 | 0, EnableEffectsToggle.top + EnableEffectsToggle.height + 2 | 0)

        this.context.globalAlpha = GiveUpToggle.selected ? 1.00 : 0.60
        this.drawString(GiveUpToggle.value, GiveUpToggle.left, GiveUpToggle.top)

        this.context.globalAlpha = CloseToggle.selected ? 1.00 : 0.60
        this.drawString(CloseToggle.value, CloseToggle.left, CloseToggle.top)

        this.context.globalAlpha = 1.00

    }

    drawInviteMenu() {

        const { AcceptInviteButton, JustWatchButton } = this.elements

        const translateX = this.container.width / 2 - AcceptInviteButton.width / 2 | 0
        const translateY = this.container.height / 2 - (AcceptInviteButton.height + JustWatchButton.height + 7) / 2 | 0

        AcceptInviteButton.left = translateX
        AcceptInviteButton.top = translateY

        JustWatchButton.left = translateX + AcceptInviteButton.width / 2 - JustWatchButton.width / 2
        JustWatchButton.top = translateY + AcceptInviteButton.height + 7

        this.context.globalAlpha = 0.60
        this.context.drawImage(this.images.separator, translateX + AcceptInviteButton.width / 2 - 17 / 2 | 0, translateY + AcceptInviteButton.height + 2 | 0)
       
        this.context.globalAlpha = AcceptInviteButton.selected ? 1.00 : 0.60
        this.drawString(AcceptInviteButton.value, AcceptInviteButton.left, AcceptInviteButton.top)
       
        this.context.globalAlpha = JustWatchButton.selected ? 1.00 : 0.60
        this.drawString(JustWatchButton.value, JustWatchButton.left, JustWatchButton.top)

        this.context.globalAlpha = 1.00
       
    }

    drawBoard() {
        this.drawOutline()
        this.drawSpots()
        this.selection && this.drawSelection(this.rotatePosition(this.selection))
        this.movements && this.drawMovements()
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
    
    drawSelection(position) {

        const rotatedPosition = this.rotatePosition(position)

        const pieceOrUndefined = this.state.board.spots[rotatedPosition.row][rotatedPosition.column]
        const image = this.images[pieceOrUndefined ? (pieceOrUndefined.player == this.state.indexOf ? "selection-piece" : "selection-jump") : "selection-spot"]

        this.context.drawImage(image, this.board.left + position.column * 16, this.board.top + position.row * 16)

    }

    drawMovements() {

        if (!this.selection)
            return this.movements.forEach(movement => this.drawSelection(this.rotatePosition(movement.startsAt)))        

        const movementFilter = (movement) => movement.startsAt.column == this.selection.column && movement.startsAt.row == this.selection.row
        const movements = this.movements.filter(movementFilter)

        for (let movement of movements) {
            for (let position of movement.positions) {
                this.drawSelection(this.rotatePosition(position))
            }
            for (let jump of movement.jumps) {
                this.drawSelection(this.rotatePosition(jump.position))
            }
        }

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
        
        if (!this.elements.OptionsButton?.selected)
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