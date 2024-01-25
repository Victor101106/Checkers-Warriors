export class FlickerRender {

    constructor(canvas, context) {
        this.timeInterval = new Date().getTime()
        this.startsAt = new Number(0)
        this.context = context
        this.canvas = canvas
    }

    render(deltatime, position) {

        this.context.fillStyle = '#000000'
        this.context.globalAlpha = 0.1

        for (let offset = this.startsAt; offset < this.canvas.height; offset += 2) {
            this.context.fillRect(position.left, position.top + offset, this.canvas.width, 1)
        }

        const currentTimeInMs = new Date().getTime()

        if (currentTimeInMs - this.timeInterval >= 125) {
            this.timeInterval = currentTimeInMs
            this.startsAt = this.startsAt ? 0 : 1
        } 

        this.context.globalAlpha = 1.0

    }

}