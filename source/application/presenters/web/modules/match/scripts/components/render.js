import { RenderFlicker } from "../../../../@shared/scripts/components/rendering/render-flicker.js"
import { loadAllSprites } from "../../../../@shared/scripts/components/loading/load-all-sprites.js"
import { loadAllAudios } from "../../../../@shared/scripts/components/loading/load-all-audios.js"
import { RenderText } from "../../../../@shared/scripts/components/rendering/render-text.js"
import { EventEmitter } from "../../../../@shared/scripts/components/event-emitter.js"
import { OptionsScreen } from "./rendering/options-screen.js"
import { InviteScreen } from "./rendering/invite-screen.js"
import { WinnerScreen } from "./rendering/winner-screen.js"
import { BoardScreen } from "./rendering/board-screen.js"

export class Render {

    // --> Constructor Function

    constructor(canvas, context, language, options) {
        this.renderFlicker = new RenderFlicker(canvas, context)
        this.renderText = new RenderText(context)
        this.events = new EventEmitter()
        this.currentScreen = undefined
        this.animations = new Array()
        this.elements = new Object()
        this.screens = new Object()
        this.language = language
        this.options = options
        this.context = context
        this.canvas = canvas
    }

    // --> Load Functions

    async loadScreens() {
        this.screens.optionsScreen = new OptionsScreen(this.canvas, this.context, this, this.language, this.options)
        this.screens.winnerScreen = new WinnerScreen(this.canvas, this.context, this)
        this.screens.inviteScreen = new InviteScreen(this.canvas, this.context, this)
        this.screens.boardScreen = new BoardScreen(this.canvas, this.context, this)
    }

    async loadImages() {
        this.sprites = await loadAllSprites()
    }

    async loadAudios() {
        this.audios = await loadAllAudios()
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

        if (this.screens.optionsScreen.options.get('audios') != 'true')
            return

        if (this.state.indexOf == -1 || this.state.winner == this.state.indexOf)
            this.audios['victory'].play()
        else
            this.audios['defeat'].play()

    }

    // --> Auxiliary Functions

    rotateDirection(direction) {
        return this.state.indexOf == 0 && this.screens.optionsScreen.options.get('rotation') == 'true' ? { column: direction.column * -1, row: direction.row * -1 } : direction
    }

    rotatePlayers() {
        return this.state.indexOf == 0 && this.screens.optionsScreen.options.get('rotation') == 'true' ? [...this.state.players].reverse() : this.state.players
    }
    
    rotateScore() {
        return this.state.indexOf == 0 && this.screens.optionsScreen.options.get('rotation') == 'true' ? [...this.state.score].reverse() : this.state.score
    }

    rotateTurn() {
        return this.state.indexOf == 0 && this.screens.optionsScreen.options.get('rotation') == 'true' ? 1 - this.state.turn : this.state.turn
    }

    rotatePosition(position) {   
        return {
            column: this.state.indexOf == 0 && this.screens.optionsScreen.options.get('rotation') == 'true' ? this.state.board.columns - position.column - 1  : position.column,
            row: this.state.indexOf == 0 && this.screens.optionsScreen.options.get('rotation') == 'true' ? this.state.board.rows - position.row - 1 : position.row
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

        if (this.screens.optionsScreen.options.get('effects') != 'true')
            return
        
        this.renderFlicker.render(this.deltatime, {
            left: -this.container.left ?? 0,
            top: -this.container.top ?? 0
        })

    }

    _renderString(string, left, top, characterImage, maxLength = Infinity, positionIncrement = 1) {
        this.renderText.render(string, { left, top }, characterImage, maxLength, positionIncrement)
    }

    // --> Final Class

}