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

        this.calculateFirstIndicators()
        this.calculateLastIndicators()

        if (this.parent.options.get('sounds') == 'true' && !this.afterEndsAt)
            this.parent.audios['move-piece-sound'].play()

    }
    
    // --> Start Function <-- //

    start() {

        this.piece = this.parent.state.board.spots[this.startsAt.row][this.startsAt.column]

        this.parent.state.board.spots[this.startsAt.row][this.startsAt.column] = undefined

        this.calculateFirstIndicators()

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
            
            this.calculateLastIndicators()
            
            if (this.parent.options.get('sounds') == 'true')
                this.parent.audios['move-piece-sound'].play()

            this.position = this.endsAt
            this.finished = true

        }

    }

    // --> Render Function <-- //

    render(deltatime = this.parent.deltatime) {
        this.parent.renderPiece(this.position.column, this.position.row, this.piece)
    }

    // --> Calculate Functions <-- //

    calculateFirstIndicators() {

        const beforeStartsAtDirection = this.beforeStartsAt ? this.parent.calculateDirection(this.beforeStartsAt, this.startsAt) : undefined
        const hasCurveBefore = beforeStartsAtDirection && !this.parent.comparePosition(beforeStartsAtDirection, this.direction)

        this.parent.indicators.moves.push({
            direction: this.parent.rotateDirection(this.direction),
            position: { ...this.startsAt },
            sprite: this.parent.indicators.moves.length && !hasCurveBefore ? 1 : 2
        })

        hasCurveBefore && this.parent.indicators.moves.push({
            direction: this.parent.rotateDirection({
                column: beforeStartsAtDirection.column * -1,
                row: beforeStartsAtDirection.row * -1,
            }),
            position: { ...this.startsAt },
            sprite: 3,
        })

    }

    calculateLastIndicators() {

        this.startsAt.column += this.direction.column
        this.startsAt.row    += this.direction.row

        while (!this.parent.comparePosition(this.endsAt, this.startsAt)) {
                
            if (!this.jumpBetween || !this.parent.comparePosition(this.jumpBetween.position, this.startsAt)) {
                this.parent.indicators.moves.push({
                    direction: this.parent.rotateDirection(this.direction),
                    position: { ...this.startsAt },
                    sprite: 1
                })
            }

            this.startsAt.column += this.direction.column
            this.startsAt.row    += this.direction.row

        }
        
        if (!this.afterEndsAt)
            this.parent.indicators.spots.push(this.endsAt)

    }

    // --> Final Class <-- //

}