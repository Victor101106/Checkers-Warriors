import { BoardAuxiliary } from '../rendering/auxiliaries/board-auxiliary.js'

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

    static resizeByBoard(canvas, columns, rows) {

        const { width: elementWidth } = BoardAuxiliary.calculateElement(columns, rows)

        const sixtyRemToPixels  = 60 * parseFloat(getComputedStyle(document.documentElement).fontSize)
        const boardWrapperWidth = Math.min(sixtyRemToPixels, window.innerWidth * 0.88)

        canvas.width  = elementWidth * window.innerWidth / boardWrapperWidth
        canvas.height = Math.max(document.body.clientHeight, window.innerHeight) * canvas.width / window.innerWidth

    }

}