import { EventEmitter } from "../event-emitter.js"

export class Inputs {
    
    constructor(canvas) {
        this.events = new EventEmitter()
        this.canvas = canvas
        this.eventHandler()
    }

    eventHandler() {
        this.canvas.onclick = (event) => this.onClickEvent(event)
    }

    onClickEvent({ x, y }) {

        const coordinate = this.coordinateToCanvas(x, y)

        this.events.emit('click', coordinate)

        if (this.board && this.container)
            this.events.emit('select-spot', this.coordinateToBoard(coordinate.x, coordinate.y))

    }

    configureContainer(container) {
        this.container = container
    }

    configureBoard(board) {
        this.board = board
    }

    coordinateToCanvas(x, y) {
        return {
            y: y * this.canvas.height / this.canvas.clientHeight | 0,
            x: x * this.canvas.width / this.canvas.clientWidth | 0
        }
    }

    coordinateToBoard(x, y) {
        return {
            column: (x - this.container.left - this.board.left) / 16 | 0,
            row: (y - this.container.top - this.board.top) / 16 | 0
        }
    }

}