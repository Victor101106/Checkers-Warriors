export class CanvasHandler {

    static resizeByProportion(canvas, innerWidth, innerHeight) {
        
        if (canvas.clientWidth / canvas.clientHeight < innerWidth / innerHeight)
            return CanvasHandler.resizeByWidth(canvas, innerWidth)
        
        CanvasHandler.resizeByHeight(canvas, innerHeight)

    }

    static resizeByWidth(canvas, innerWidth) {
        canvas.width  = Math.round(innerWidth)
        canvas.height = Math.round(canvas.clientHeight * canvas.width / canvas.clientWidth)
    }

    static resizeByHeight(canvas, innerHeight) {
        canvas.height = Math.round(innerHeight)
        canvas.width  = Math.round(canvas.clientWidth * canvas.height / canvas.clientHeight)
    }

}