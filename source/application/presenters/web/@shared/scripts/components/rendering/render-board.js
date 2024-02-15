import { BoardAuxiliary } from "./auxiliaries/board-auxiliary.js"

export class RenderBoard extends BoardAuxiliary {

    // --> Class Statements <-- //

    indicators = new Object({
        jumps: new Array(),
        moves: new Array(),
        spots: new Array()
    })

    animations = new Array()
    movements  = new Array()
    selection  = undefined

    // --> Constructor Function <-- //

    constructor(canvas, context, sprites, audios, options) {
        
        super(undefined, options)

        this.context = context
        this.sprites = sprites
        this.audios = audios
        this.canvas = canvas

    }

    // --> Render Function <-- //

    render(state, position, deltatime) {

        this.deltatime = deltatime
        this.position = position
        this.state = state

        this.calculateElement()
        this.updateAnimations()
        this.renderBackground()
        this.renderSpots()
        this.renderIndicators()
        this.renderMovements()
        this.renderPieces()
        this.renderAnimation()

    }

    // --> Animation Functions <-- //

    updateAnimations() {

        if (this.options.get('animations') == 'true')
            return this.updateAnimation(0)

        for (let index = 0; index < this.animations.length; index++) {

            const animation = this.animations[index]
                  animation.skip && animation.skip()

            if (animation.final)
                this.updateAnimation(index)            

        }

        this.animations.length = 0

    }
    
    updateAnimation(index = 0) {

        if (!this.animations.length || index >= this.animations.length)
            return

        const animation = this.animations[index]

        if (animation.final)
            return this.requestFinalMovement(this.animations.splice(index, 1)[0].movement)

        if (!animation.started)
             animation.start()

        animation.update(this.deltatime)

        if (!animation.stopQueue)
            this.updateAnimation(index + 1)
        
    }

    renderAnimation(index = 0) {

        if (!this.animations.length || index >= this.animations.length)
            return

        const animation = this.animations[index]
              animation.render(this.deltatime)

        if (!animation.stopQueue)
            this.renderAnimation(index + 1)

        if (animation.finished)
            this.animations.splice(index, 1)
        
    }

    // --> Render Functions <-- //

    renderBackground() {
        this.context.fillStyle = '#071916'
        this.context.fillRect(this.element.left, this.element.top, this.element.width, this.element.height)
    }

    renderSpots() {

        for (let row = 0; row < this.state.board.rows; row++) {
            for (let column = 0; column < this.state.board.columns; column++) {
                this.context.fillStyle = (column + row) % 2 == 0 ? '#f8fffa' : '#8dc3a7'
                this.context.fillRect(this.element.left + 16 * column + 1, this.element.top + 16 * row + 1, 16, 16)
            }
        }

        for (let column = 0; column < this.state.board.columns; column++) {
            this.context.fillStyle = (column + this.state.board.rows) % 2 == 1 ? '#dfeae2' : '#207567'
            this.context.fillRect(this.element.left + 16 * column + 1, this.element.top + 16 * this.state.board.rows + 1, 16, 6)
        }

    }

    renderPieces() {
        for (let row = 0; row < this.state.board.rows; row++) {
            for (let column = 0; column < this.state.board.columns; column++) {
                this.renderPiece(column, row, this.state.board.spots[row][column])
            }
        }
    }

    renderPiece(column, row, piece) {

        if (!piece)
            return

        const sprite = this.sprites[`piece-${piece.player ? 'black' : 'white'}`]
        const rotatedPosition = this.rotatePosition({ column, row })

        this.context.drawImage(sprite, Math.round(this.element.left + rotatedPosition.column * 16 + 3), Math.round(this.element.top + rotatedPosition.row * 16 + 3))

        if (piece.promoted)
            this.renderCrown(column, row)

    }

    renderCrown(column, row) {

        const rotatedPosition = this.rotatePosition({ column, row })
        
        this.context.drawImage(this.sprites['piece-crown'], Math.round(this.element.left + rotatedPosition.column * 16 + 4), Math.round(this.element.top + rotatedPosition.row * 16 - 1))
        
    }
    
    renderCrownSelection(column, row) {

        const rotatedPosition = this.rotatePosition({ column, row })

        this.context.drawImage(this.sprites['selection-crown'], Math.round(this.element.left + rotatedPosition.column * 16 + 3), Math.round(this.element.top + rotatedPosition.row * 16 - 2))

    }

    renderMovements() {

        if (!this.selection)
            return this.movements.forEach(movement => this.renderSelection(movement.startsAt.column, movement.startsAt.row, 'piece'))    
        
        const movementFilter = (movement) => this.comparePosition(movement.startsAt, this.selection)

        const filteredMovements = this.movements.filter(movementFilter)

        if (filteredMovements.length)
            this.renderSelection(this.selection.column, this.selection.row, 'piece')

        for (let movement of filteredMovements) {
            for (let object of [ ...movement.positions, ...movement.jumps ]) {
                this.renderSelection(object.position?.column ?? object.column, object.position?.row ?? object.row, object.position ? 'jump' : 'spot')
            }
        }
        
    }

    renderSelection(column, row, type) {

        const rotatedPosition = this.rotatePosition({ column, row })

        const sprite = this.sprites[`selection-${type}`] ?? this.sprites['selection-spot']

        this.context.drawImage(sprite, this.element.left + rotatedPosition.column * 16 + 1, this.element.top + rotatedPosition.row * 16 + 1)

    }

    renderIndicators() { 

        if (this.selection)
            return

        const directions = [
            { column:  1, row: -1 },
            { column:  1, row:  1 },
            { column: -1, row: -1 },
            { column: -1, row:  1 }
        ]
        
        for (let indicator of this.indicators.moves) {
            
            const rotatedPosition  = this.rotatePosition(indicator.position)

            const spriteObject = this.sprites[`indicator-move-${indicator.sprite}`]
            const spriteIndex = directions.findIndex((direction) => this.comparePosition(indicator.direction, direction))

            this.context.drawImage(spriteObject, spriteObject.width / 4 * spriteIndex, 0, spriteObject.width / 4, spriteObject.height, Math.round(this.element.left + rotatedPosition.column * 16 + 1), Math.round(this.element.top + rotatedPosition.row * 16 + 1), spriteObject.width / 4, spriteObject.height)

        }

        for (let indicator of this.indicators.jumps) {

            const rotatedPosition  = this.rotatePosition(indicator)

            this.context.drawImage(this.sprites['indicator-jump'], Math.round(this.element.left + rotatedPosition.column * 16 + 1), Math.round(this.element.top + rotatedPosition.row * 16 + 1))

        }

        for (let indicator of this.indicators.spots) {

            const rotatedPosition  = this.rotatePosition(indicator)

            this.context.drawImage(this.sprites['indicator-slot'], Math.round(this.element.left + rotatedPosition.column * 16 + 1), Math.round(this.element.top + rotatedPosition.row * 16 + 1))

        }

    }

    // --> Final Class <-- //

}