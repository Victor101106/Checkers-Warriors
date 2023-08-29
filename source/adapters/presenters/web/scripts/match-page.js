import { Socket } from "./components/match/socket.js"
import { Render } from "./components/match/render.js"
import { Config } from "./components/match/config.js"
import { Inputs } from "./components/match/inputs.js"

const canvas  = document.querySelector('canvas')
const context = canvas.getContext('2d')

const render = new Render(canvas, context)
const inputs = new Inputs(canvas)
const config = new Config(canvas)
const socket = new Socket()

socket.events.on('receive-match-accepted', async (event) => {
    config.configureContainer(event)
    config.configureTitle(event)
    render.configureState(event)
    config.configureCanvas()
})

socket.events.on('receive-match-rejected', async (event) => {
    window.location.assign('/')
})

config.events.on('updated-container', (container) => {
    render.configureContainer(container)
    inputs.configureContainer(container)
})

render.events.on('updated-board', (board) => {
    inputs.configureBoard(board)
})

window.onload = async () => {
    await render.configureImages()
    socket.receiveMatch(matchId)
    render.configureEffect()
    render.beginRendering()
}

window.onresize = () => {
    config.configureCanvas()
}