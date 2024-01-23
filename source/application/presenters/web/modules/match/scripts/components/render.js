import { EventEmitter } from "../../../../@shared/scripts/components/event-emitter.js"
import { OptionsScreen } from "./rendering/options-screen.js"
import { InviteScreen } from "./rendering/invite-screen.js"
import { WinnerScreen } from "./rendering/winner-screen.js"
import { BoardScreen } from "./rendering/board-screen.js"
import { loadImage } from "./loading/load-image.js"
import { loadAudio } from "./loading/load-audio.js"

export class Render {

    // --> Constructor Function

    constructor(canvas, context) {
        this.effect = { top: 0, time: new Date().getTime() }
        this.events = new EventEmitter()
        this.currentScreen = undefined
        this.animations = new Array()
        this.elements = new Object()
        this.screens = new Object()
        this.sounds = new Object()
        this.images = new Object()
        this.context = context
        this.canvas = canvas
    }

    // --> Load Functions

    async loadScreens() {
        this.screens.optionsScreen = new OptionsScreen(this.canvas, this.context, this)
        this.screens.winnerScreen = new WinnerScreen(this.canvas, this.context, this)
        this.screens.inviteScreen = new InviteScreen(this.canvas, this.context, this)
        this.screens.boardScreen = new BoardScreen(this.canvas, this.context, this)
    }

    async loadImages() {
        this.images.sectionSeparator = await loadImage('../static/modules/match/assets/images/section-separator.png')
        this.images.charactersGreen = await loadImage('../static/modules/match/assets/images/characters-green.png')
        this.images.indicatorMove1 = await loadImage('../static/modules/match/assets/images/indicator-move-1.png')
        this.images.indicatorMove2 = await loadImage('../static/modules/match/assets/images/indicator-move-2.png')
        this.images.indicatorMove3 = await loadImage('../static/modules/match/assets/images/indicator-move-3.png')
        this.images.languageSwitch = await loadImage('../static/modules/match/assets/images/language-switch.png')
        this.images.characterColon = await loadImage('../static/modules/match/assets/images/character-colon.png')
        this.images.characterCross = await loadImage('../static/modules/match/assets/images/character-cross.png')
        this.images.characterLines = await loadImage('../static/modules/match/assets/images/character-lines.png')
        this.images.indicatorRight = await loadImage('../static/modules/match/assets/images/indicator-right.png')
        this.images.profilePicture = await loadImage('../static/modules/match/assets/images/profile-picture.png')
        this.images.selectionPiece = await loadImage('../static/modules/match/assets/images/selection-piece.png')
        this.images.selectionQueen = await loadImage('../static/modules/match/assets/images/selection-queen.png')
        this.images.selectionCrown = await loadImage('../static/modules/match/assets/images/selection-crown.png')
        this.images.lossTextBlack = await loadImage('../static/modules/match/assets/images/loss-text-black.png')
        this.images.lossTextWhite = await loadImage('../static/modules/match/assets/images/loss-text-white.png')
        this.images.indicatorJump = await loadImage('../static/modules/match/assets/images/indicator-jump.png')
        this.images.indicatorSlot = await loadImage('../static/modules/match/assets/images/indicator-slot.png')
        this.images.charactersRed = await loadImage('../static/modules/match/assets/images/characters-red.png')
        this.images.indicatorLeft = await loadImage('../static/modules/match/assets/images/indicator-left.png')
        this.images.selectionJump = await loadImage('../static/modules/match/assets/images/selection-jump.png')
        this.images.selectionSpot = await loadImage('../static/modules/match/assets/images/selection-spot.png')
        this.images.wonTextWhite = await loadImage('../static/modules/match/assets/images/won-text-white.png')
        this.images.wonTextBlack = await loadImage('../static/modules/match/assets/images/won-text-black.png')
        this.images.checkBoxOff = await loadImage('../static/modules/match/assets/images/check-box-off.png')
        this.images.checkBoxOn = await loadImage('../static/modules/match/assets/images/check-box-on.png')
        this.images.pieceCrown = await loadImage('../static/modules/match/assets/images/piece-crown.png')
        this.images.pieceBlack = await loadImage('../static/modules/match/assets/images/piece-black.png')
        this.images.pieceWhite = await loadImage('../static/modules/match/assets/images/piece-white.png')
        this.images.particle01 = await loadImage('../static/modules/match/assets/images/particle-01.png')
        this.images.particle02 = await loadImage('../static/modules/match/assets/images/particle-02.png')
        this.images.particle03 = await loadImage('../static/modules/match/assets/images/particle-03.png')
        this.images.particle04 = await loadImage('../static/modules/match/assets/images/particle-04.png')
        this.images.particle05 = await loadImage('../static/modules/match/assets/images/particle-05.png')
    }

    async loadAudios() {
        this.sounds.mouseClickSound = await loadAudio('../static/modules/match/assets/sounds/mouse-click-sound.mp3')
        this.sounds.backgroundSound = await loadAudio('../static/modules/match/assets/sounds/background-sound.mp3')
        this.sounds.movePieceSound = await loadAudio('../static/modules/match/assets/sounds/move-piece-sound.mp3')
        this.sounds.promotionSound = await loadAudio('../static/modules/match/assets/sounds/promotion-sound.mp3')
        this.sounds.victorySound = await loadAudio('../static/modules/match/assets/sounds/victory-sound.mp3')
        this.sounds.defeatSound = await loadAudio('../static/modules/match/assets/sounds/defeat-sound.mp3')
    }

    // --> Receive Functions

    receiveContainer(container, board) {
        this.container = container
        this.configureTranslate()
        this.board = board
    }

    receiveState(state) {

        this.state = state

        if (state.winner != undefined)
            return this.configureWinner(state.winner)

        if (this.state.indexOf == -1 && !this.state.players[1])
            return this.currentScreen = this.screens.inviteScreen

        this.currentScreen = this.screens.boardScreen

    }

    // --> Configure Functions

    configureTranslate() {
        this.context.reset()
        this.context.translate(this.container.left, this.container.top)
    }

    configureElements() {
        this.elements = new Object()
        this.screens.optionsScreen.configureElements()
        this.screens.winnerScreen.configureElements()
        this.screens.inviteScreen.configureElements()
        this.screens.boardScreen.configureElements()
    }

    configureWinner(winner) {
        
        this.currentScreen = this.screens.winnerScreen
        this.state.winner = winner

        if (!this.screens.optionsScreen.options.enableSounds)
            return

        if (this.state.indexOf == -1 || this.state.winner == this.state.indexOf)
            this.sounds.victorySound.play()
        else
            this.sounds.defeatSound.play()

    }

    // --> Auxiliary Functions

    rotateDirection(direction) {
        return this.state.indexOf == 0 && this.screens.optionsScreen.options.enableRotation ? { column: direction.column * -1, row: direction.row * -1 } : direction
    }

    rotatePlayers() {
        return this.state.indexOf == 0 && this.screens.optionsScreen.options.enableRotation ? [...this.state.players].reverse() : this.state.players
    }
    
    rotateScore() {
        return this.state.indexOf == 0 && this.screens.optionsScreen.options.enableRotation ? [...this.state.score].reverse() : this.state.score
    }

    rotateTurn() {
        return this.state.indexOf == 0 && this.screens.optionsScreen.options.enableRotation ? 1 - this.state.turn : this.state.turn
    }

    rotatePosition(position) {   
        return {
            column: this.state.indexOf == 0 && this.screens.optionsScreen.options.enableRotation ? this.state.board.columns - position.column - 1  : position.column,
            row: this.state.indexOf == 0 && this.screens.optionsScreen.options.enableRotation ? this.state.board.rows - position.row - 1 : position.row
        }
    }

    reverseTurn() {
        this.state.turn = this.state.turn == 0 ? 1 : 0
    }

    // --> Element Functions

    createElement(id, left, top, width, height, caption, onclick, screen) {
        return this.elements[id] = { id, left, top, width, height, caption, onclick, screen }
    }

    deleteElement(id) {
        delete this.elements[id]
    }

    getElement(id) {
        return this.elements[id]
    }

    // --> Animation Functions

    _calculteAnimation() {
        
        const animation =  this.animations.at(0)

        if (animation)
            animation.callback(animation.data)

    }

    enqueueAnimation(data, callback) {
        this.animations.push({ data, callback })
    }

    dequeueAnimation() {
        this.animations.shift()
    }

    // --> Rendering Functions

    beginRendering() {

        this.deltatime = (new Date().getTime() - this.deltatime0) / 1000 || 0
        this.deltatime0 = new Date().getTime()
        
        this._calculteAnimation()
        this._renderBackground()
        this._renderScreen()
        this._renderEffects()
        
        requestAnimationFrame(() => this.beginRendering())

    }

    // --> Render Functions

    _renderBackground() {
        this.context.fillStyle = '#0d302a'
        this.context.fillRect(0 - this.container?.left, 0 - this.container?.top, this.canvas.width, this.canvas.height)
    }

    _renderScreen() {
        this.currentScreen?.render && this.currentScreen.render(this.deltatime)
    }

    _renderEffects() {

        if (!this.screens.optionsScreen.options.enableEffects)
            return
        
        this.context.fillStyle = '#000000'
        this.context.globalAlpha = 0.1
        
        for (let top = this.effect.top; top < this.canvas.height; top += 2)
            this.context.fillRect(0 - this.container?.left, top - this.container?.top, this.canvas.width, 1)

        const currentDate = new Date().getTime()

        if (currentDate - this.effect.time >= 125) {
            this.effect.top  = this.effect.top ? 0 : 1
            this.effect.time = currentDate
        } 

        this.context.globalAlpha = 1.0

    }

    _renderString(string, left, top, characters, length = Infinity, increment = 1) {

        for (let character of string.toLowerCase()) {

            if (length == 0)
                return

            const characterCode  = character.charCodeAt(0) - 97
            const characterIndex = characterCode < 0 || characterCode > 25 ? 26 : characterCode

            const parsedInteger = Number.parseInt(character)

            if (character != ' ')
                this.context.drawImage(characters, (isNaN(parsedInteger) ? characterIndex : 27 + parsedInteger) * 3, 0, 3, 5, left, top, 3, 5)
            
            left   += 4 * increment
            length -= 1

        }

    }

    // --> Final Class

}