export class PromotionAnimation {

    // --> Class Statements <-- //

    effectTransparency = 0
    crownTransparency = 0
    crownPosition = -0.5

    transitionCount = 0
    transitionValue = 0

    stopQueue = true
    finished = false
    started = false

    // --> Constructor Function <-- //

    constructor (canvas, context, parent) {
        this.context = context
        this.canvas = canvas
        this.parent = parent
    }

    // --> Receive Function <-- //

    receive(position) {
        this.position = position
    }

    // --> Skip Function <-- //

    skip() {
        this.parent.state.board.spots[this.position.row][this.position.column].promoted = true
    }

    // --> Start Function <-- //

    start() {
        
        this.piece = this.parent.state.board.spots[this.position.row][this.position.column]

        if (this.parent.options.get('sounds') == 'true')
            this.parent.audios['promotion-sound'].play()
        
        this.started = true

    }

    // --> Update Function <-- //

    update(deltatime = this.parent.deltatime) {
        
        if (this.crownTransparency < 1) {
            this.effectTransparency = Math.min(this.effectTransparency + deltatime / 1.25, 1)
            this.crownTransparency = Math.min(this.crownTransparency + deltatime / 1.25, 1)
            return
        }

        if (this.transitionCount == 0 && this.transitionValue < 1)
            return this.transitionValue += deltatime / 1.25

        if (this.transitionCount == 0)
            this.transitionCount = 1

        if (this.crownPosition < 0)
            return this.crownPosition = Math.min(this.crownPosition + 0.5 * deltatime / 1.5, 0)

        if (this.transitionCount == 1  && this.transitionValue > 0)
            return this.transitionValue -= deltatime / 1.25
        
        if (this.effectTransparency > 0)
            return this.effectTransparency = Math.max(this.effectTransparency - deltatime, 0)
    
        this.piece.promoted = true
        this.finished = true

    }

    // --> Render Function <-- //

    render(deltatime = this.parent.deltatime) {

        const rotateCrownPosition = this.parent.rotationEnabled() ? this.crownPosition * -1 : this.crownPosition

        this.context.globalAlpha = 0.75 * this.effectTransparency
        this.context.fillStyle = '#0d302a'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
        
        this.context.globalAlpha = this.effectTransparency
        this.parent.renderCrownSelection(this.position.column, this.position.row + rotateCrownPosition)
        this.parent.renderSelection(this.position.column, this.position.row, 'queen')

        this.context.globalAlpha = 1.00
        this.parent.renderPiece(this.position.column, this.position.row, this.piece)

        this.context.globalAlpha = this.crownTransparency
        this.parent.renderCrown(this.position.column, this.position.row + rotateCrownPosition) 
        this.context.globalAlpha = 1.00

    }

    // --> Final Class <-- //

}