export class MovementAnimation {

    // --> Class Statements <-- //

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

    receive(beforeStartsAt, startsAt, endsAt, afterEndsAt, jumpBetween) {
        
        this.direction = this.parent.calculateDirection(startsAt, endsAt)
        this.distance = this.parent.calculateDistance(startsAt, endsAt)
        this.position = { ...startsAt }

        this.beforeStartsAt = beforeStartsAt
        this.afterEndsAt = afterEndsAt
        this.jumpBetween = jumpBetween
        this.startsAt = startsAt
        this.endsAt = endsAt
        
    }

    // --> Skip Function <-- //

    skip() {

        this.piece = this.parent.state.board.spots[this.startsAt.row][this.startsAt.column]
        
        this.parent.state.board.spots[this.startsAt.row][this.startsAt.column] = undefined
        this.parent.state.board.spots[this.endsAt.row][this.endsAt.column] = this.piece

        this.parent.calculateInitialIndicators(this.beforeStartsAt, this.startsAt, this.endsAt)
        this.parent.calculateFinalIndicators(this.startsAt, this.endsAt, this.afterEndsAt, this.jumpBetween)

        if (this.parent.options.get('audios') == 'true' && !this.afterEndsAt)
            this.parent.audios['move-piece'].play()

    }
    
    // --> Start Function <-- //

    start() {

        this.piece = this.parent.state.board.spots[this.startsAt.row][this.startsAt.column]

        this.parent.state.board.spots[this.startsAt.row][this.startsAt.column] = undefined

        this.parent.calculateInitialIndicators(this.beforeStartsAt, this.startsAt, this.endsAt)

        this.started = true
        
    }

    // --> Update Function <-- //

    update(deltatime = this.parent.deltatime) {

        const componentX = 10 * deltatime * this.direction.column
        const componentY = 10 * deltatime * this.direction.row

        this.distance.column -= Math.abs(componentX)
        this.distance.row -= Math.abs(componentY)

        this.position.column += componentX
        this.position.row += componentY

        if (this.distance.column < 0 || this.distance.row < 0) {
            
            this.parent.state.board.spots[this.endsAt.row][this.endsAt.column] = this.piece
            
            this.parent.calculateFinalIndicators(this.startsAt, this.endsAt, this.afterEndsAt, this.jumpBetween)
            
            if (this.parent.options.get('audios') == 'true')
                this.parent.audios['move-piece'].play()

            this.position = this.endsAt
            this.finished = true

        }

    }

    // --> Render Function <-- //

    render(deltatime = this.parent.deltatime) {
        this.parent.renderPiece(this.position.column, this.position.row, this.piece)
    }

    // --> Final Class <-- //

}