import { EventEmitter } from "../../../../shared/scripts/components/event-emitter.js"

export class Inputs {
    
    // --> Constructor Function
    
    constructor(canvas, render) {
        this.events = new EventEmitter()
        this.render = render
        this.canvas = canvas
        this.configureHandler()
    }

    // --> Event Handler Function

    configureHandler() {
        this.canvas.onmousemove = (event) => this.container && this._mouseMoveEvent(event)
        this.canvas.onclick = (event) => this.container && this._canvasClickEvent(event)
    }

    // --> Event Functions

    _canvasClickEvent(event) {

        const coordinate = this.mousePositionToCoordinate(event.x, event.y)

        for (let element of Object.values(this.render.elements)) {
            if (this.intersect(coordinate, element) && element.onclick && element.screen == this.render.currentScreen) {
                if (!element.onclick(coordinate) && this.render.screens.optionsScreen.options.enableSounds)
                    this.render.sounds.mouseClickSound.play()
            }
        }

        this.events.emit('onclick', coordinate)

    }

    _mouseMoveEvent(event) {

        const coordinate = this.mousePositionToCoordinate(event.x, event.y)

        for (let element of Object.values(this.render.elements)) {
            element.hovering = element.screen == this.render.currentScreen && this.intersect(coordinate, element)
        }

        this.events.emit('onhover', coordinate)

    }

    // --> Receive Functions

    receiveContainer(container, board) {
        this.container = container
        this.board = board
    }

    // --> Auxiliary Functions

    intersect(coordinate, element, container = this.container) {

        const intersectX = coordinate.x >= container.left + element.left && coordinate.x < container.left + element.left + element.width
        const intersectY = coordinate.y >= container.top + element.top && coordinate.y < container.top + element.top + element.height

        return intersectX && intersectY

    }

    // --> Convertion Functions

    mousePositionToCoordinate(x, y) {
        return {
            y: y * this.canvas.height / this.canvas.clientHeight | 0,
            x: x * this.canvas.width / this.canvas.clientWidth | 0
        }
    }

    // --> Final Class
    
}