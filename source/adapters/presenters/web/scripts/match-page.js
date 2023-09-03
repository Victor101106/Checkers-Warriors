import { Socket } from "./components/match/socket.js"
import { Render } from "./components/match/render.js"
import { Config } from "./components/match/config.js"
import { Inputs } from "./components/match/inputs.js"

const canvas  = document.querySelector('canvas')
const context = canvas.getContext('2d')

const render = new Render(canvas, context)
const inputs = new Inputs(canvas, render.elements)
const config = new Config(canvas)
const socket = new Socket()

socket.events.on('receive-match-accepted', async (event) => {
    
    config.configureContainer(event)
    config.configureTitle(event)
    render.configureState(event)
    render.configureOptionsMenu()
    render.configureInviteMenu()
    config.configureCanvas()

    if (event.turn == event.indexOf)
        socket.findAllMovements()

})

socket.events.on('receive-match-rejected', async (event) => {
    window.location.assign('/')
})

socket.events.on('find-all-movements-accepted', async (event) => {
    render.movements = event
})

socket.events.on('find-all-movements-rejected', async (event) => {
    console.error(event)
})

render.events.on('request-join-match', async (event) => {
    socket.joinMatch()
})

render.events.on('request-move-piece', async (event) => {
    socket.movePiece(event)
})

socket.events.on('join-match-accepted', async (event) => {
    
    render.state.indexOf = event.indexOf
    
    if (render.state.turn == event.indexOf)
        socket.findAllMovements()

})

socket.events.on('join-match-rejected', async (event) => {
    console.error(event)
})

socket.events.on('player-joined', async (event) => {
    render.state.players[1] = event.player
    render.showInvite = false
})

socket.events.on('move-piece-rejected', async (event) => {
    console.error(event)
})

socket.events.on('move-piece', async (event) => {
    
    render.movements = undefined
    render.selection = undefined
    render.movePiece(event)
    render.reverseTurn()

    if (render.state.turn == render.state.indexOf)
        socket.findAllMovements()

})

render.events.on('request-give-up', (event) => {
    socket.giveUp()
})

socket.events.on('abandoned-match', (event) => {
    render.configureWinner(event.winner)
    render.showOptions = false
}) 

socket.events.on('give-up-rejected', (event) => {
    console.error(event)
})

config.events.on('updated-container', (container) => {
    render.configureContainer(container)
    inputs.configureContainer(container)
})

render.events.on('updated-board', (board) => {
    inputs.configureBoard(board)
})

inputs.events.on('onclick', (coordinate, position) => {
    render.selectSpot(position)
})

window.onload = async () => {
    await render.configureImages()
    await render.configureSounds()
    socket.receiveMatch(matchId)
    render.configureEffect()
    render.beginRendering()
}

window.onresize = () => {
    config.configureCanvas()
}