import { PieceJumpAnimation } from "../animations/piece-jump-animation.js"
import { PromotionAnimation } from "../animations/promotion-animation.js"
import { MovementAnimation } from "../animations/movement-animation.js"
import { OptionHandler } from "../../handlers/option-handler.js"
import { EventEmitter } from "../../event-emitter.js"

export class BoardAuxiliary {

    // --> Constructor Function <-- //

    constructor(events, options) {
        this.options = options ?? new OptionHandler()
        this.events = events ?? new EventEmitter()
    }

    // --> Request Functions <-- //

    requestFinalMovement(movement) {

        if (movement.winnner)
            return this.events.emit('winner', movement.endsAt)

        this.reverseTurn()
    
        if (this.state.turn == this.state.indexOf)
            this.requestAllMovements()

    }

    requestAllMovements() {
        this.events.emit('request-all-movements')
    }

    requestMovePiece(startsAt, endsAt) {
        this.events.emit('request-move-piece', { startsAt, endsAt })
    }

    // --> Calculate Functions <-- //

    calculateMovement(movement) {
        
        this.indicators.jumps = new Array()
        this.indicators.moves = new Array()
        this.indicators.spots = new Array()

        this.movements = new Array()
        this.selection = undefined

        for (let index = 0; index < movement.positions.length; index++) {

            const movementAnimation = new MovementAnimation(this.canvas, this.context, this)
                  movementAnimation.receive(movement.positions[index - 2] || movement.startsAt, movement.positions[index - 1] || movement.startsAt, movement.positions[index], movement.positions[index + 1], movement.jumps[0])

            this.animations.push(movementAnimation)

            if (movement.jumps.length) {

                const pieceJumpAnimation = new PieceJumpAnimation(this.canvas, this.context, this)
                      pieceJumpAnimation.receive(movement.jumps.shift())

                this.animations.push(pieceJumpAnimation)
                
            }

        }

        if (movement.promoted) {

            const promotionAnimation = new PromotionAnimation(this.canvas, this.context, this)
                  promotionAnimation.receive(movement.endsAt)
            
            this.animations.push(promotionAnimation)

        }

        this.animations.push({ final: true, movement })

    }

    calculateElement(state = this.state, position = this.position) {
        
        const height = state.board.rows * 16 + 8
        const width = state.board.columns * 16 + 2

        this.element = { ...position, height, width }

        return this.element

    }
    
    calculateSelection(coordinate) {

        const position = this.calculateCoordinateToPosition(coordinate)
        const rotatedPosition = this.rotatePosition(position)

        const positionAlreadySelected = this.selection && this.comparePosition(this.selection, rotatedPosition)

        const columnOutsideBoard = position.column < 0 || position.column >= this.state.board.columns
        const rowOutsideBoard = position.row < 0 || position.row >= this.state.board.rows

        if (columnOutsideBoard || rowOutsideBoard || positionAlreadySelected)
            return this.selection = undefined

        if (this.selection && this.movements.find((movement) => this.comparePosition(this.selection, movement.startsAt) && this.comparePosition(rotatedPosition, movement.endsAt)))
            return this.requestMovePiece(this.selection, rotatedPosition)

        if (!this.movements.find((movement) => this.comparePosition(rotatedPosition, movement.startsAt)))
            return this.selection = undefined

        this.selection = rotatedPosition

    }

    calculateCoordinateToPosition(coordinate) {

        const column = Math.floor((coordinate.x - this.element.left) / 16)
        const row = Math.floor((coordinate.y - this.element.top) / 16)

        return { column, row }

    }

    calculateDistance(startsAt, endsAt) {
        
        const column = Math.abs(endsAt.column - startsAt.column)
        const row = Math.abs(endsAt.row - startsAt.row)

        return { column, row }

    }

    calculateDirection(startsAt, endsAt) {

        const column = Math.sign(endsAt.column - startsAt.column)
        const row = Math.sign(endsAt.row - startsAt.row)

        return { column, row }

    }

    // --> Rotate Functions <-- //

    rotationEnabled() {
        return this.state.indexOf == 0 && this.options.get('rotation') == 'true'
    }

    rotatePosition(position) {
        
        const rotationNotEnabled = !this.rotationEnabled()

        if (rotationNotEnabled)
            return position

        return {
            column: this.state.board.columns - position.column - 1,
            row: this.state.board.rows - position.row - 1 
        }

    }

    rotateDirection(direction) {

        const rotationNotEnabled = !this.rotationEnabled()

        if (rotationNotEnabled)
            return direction

        return {
            column: direction.column * -1,
            row: direction.row  * -1
        }

    }

    // --> Compare Functions <-- //
    
    comparePosition(position1, position2) {

        const compareColumn = position1.column == position2.column
        const compareRow = position1.row == position2.row

        return compareColumn && compareRow

    }

    // --> Reverse Functions <-- //

    reverseTurn() {
        this.state.turn = this.state.turn ? 0 : 1
    }

    // --> Final CLass <-- //
 
}