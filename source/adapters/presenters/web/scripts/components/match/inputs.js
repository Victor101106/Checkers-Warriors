import { EventEmitter } from "../event-emitter.js"

export class Inputs {
    
// <-- Constructor Function --> //

    constructor(canvas, elements) {
        this.events = new EventEmitter()
        this.elements = elements
        this.canvas = canvas
        this.eventHandler()
    }

    // <-- Event Functions --> //

    eventHandler() {
        this.canvas.onmousemove = (event) => this.onMouseMoveEvent(event)
        this.canvas.onclick = (event) => this.onClickEvent(event)
    }

    onClickEvent({ x, y }) {

        const coordinate = this.coordinateToCanvas(x, y)
        const position = this.coordinateToBoard(coordinate.x, coordinate.y)

        for (let element of Object.values(this.elements)) {
            if (this.intersect(coordinate, element)) {
                element.onclick && element.onclick()
            }
        }

        this.events.emit('onclick', coordinate, position)

    }

    onMouseMoveEvent({ x, y }) {

        const coordinate = this.coordinateToCanvas(x, y)

        for (let element of Object.values(this.elements)) {
            element.selected = this.intersect(coordinate, element)
        }

        this.events.emit('onhover', coordinate)

    }

    // <-- Configure Functions --> //

    configureContainer(container) {
        this.container = container
    }

    configureBoard(board) {
        this.board = board
    }

    // <-- Utility Functions --> //

    intersect(coordinate, element, container = this.container) {

        const intersectX = coordinate.x >= container.left + element.left && coordinate.x < container.left + element.left + element.width
        const intersectY = coordinate.y >= container.top + element.top && coordinate.y < container.top + element.top + element.height

        return intersectX && intersectY

    }

    // <-- Convert Functions --> //

    coordinateToCanvas(x, y) {
        return {
            y: y * this.canvas.height / this.canvas.clientHeight | 0,
            x: x * this.canvas.width / this.canvas.clientWidth | 0
        }
    }

    coordinateToBoard(x, y) {
        return {
            column: Math.floor((x - this.container.left - this.board.left) / 16),
            row: Math.floor((y - this.container.top - this.board.top) / 16)
        }
    }

    // <-- Final Class --> //

}