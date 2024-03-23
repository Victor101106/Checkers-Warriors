import { CanvasHandler } from '../handlers/canvas-handler.js'
import { RenderFlicker } from './render-flicker.js'

const canvas  = document.querySelector('#canvas-overlay')
const context = canvas.getContext('2d')

const flicker = new RenderFlicker(canvas, context)

function renderOverlay() {

    context.clearRect(0, 0, canvas.width, canvas.height)

    flicker.render(undefined, { left: 0, top: 0 })

    requestAnimationFrame(renderOverlay)

}

window.onresize = function() {
    CanvasHandler.resizeByBoard(canvas, 8, 8)
}

window.onload = function() {
    CanvasHandler.resizeByBoard(canvas, 8, 8)
    renderOverlay()
}