// --> Imports

import { LanguageHandler } from "../../../@shared/scripts/components/handlers/language-handler.js"
import { OptionHandler } from "../../../@shared/scripts/components/handlers/option-handler.js"

import { Socket } from "./components/socket.js"
import { Render } from "./components/render.js"
import { Config } from "./components/config.js"
import { Inputs } from "./components/inputs.js"

// --> Statements

const canvas  = document.querySelector('canvas')
const context = canvas.getContext('2d')

const options  = new OptionHandler()
const language = new LanguageHandler(options)

const render = new Render(canvas, context, language, options)
const inputs = new Inputs(canvas, render)
const config = new Config(canvas, language)
const socket = new Socket()

// --> Socket Events

socket.events.on('receive-match-accepted', async (event) => {

    await render.loadImages()
    await render.loadAudios()
    await render.loadScreens()

    config.configureContainer(event)
    config.configureBoard(event)
    config.configureTitle(event)
    config.configureCanvas()

    render.receiveState(event)
    render.configureElements()
    render.beginRendering()

    if (event.movements.length)
        render.screens.boardScreen.renderBoard.calculateMovementIndicators(event.movements.at(-1))

    if (event.turn == event.indexOf)
        socket.findAllMovements()

})

socket.events.on('receive-match-rejected', async (event) => {
    window.location.assign('/')
})

socket.events.on('find-all-movements-accepted', async (event) => {
    render.screens.boardScreen.renderBoard.movements = event
})

socket.events.on('find-all-movements-rejected', async (event) => {
    console.error(event)
})

socket.events.on('move-piece', async (event) => {
    render.screens.boardScreen._movePieceEvent(event)
})

socket.events.on('move-piece-rejected', async (event) => {
    console.error(event)
})

socket.events.on('join-match-accepted', async (event) => {
    
    render.currentScreen = render.screens.boardScreen
    render.state.indexOf = event.indexOf
    
    if (render.state.turn == event.indexOf)
        socket.findAllMovements()
    
})

socket.events.on('join-match-rejected', async (event) => {
    console.error(event)
})

socket.events.on('player-joined', async (event) => {
    
    if (render.currentScreen == render.screens.inviteScreen)
        render.currentScreen = render.screens.boardScreen
    
    render.state.players[1] = event.player

})

socket.events.on('abandoned-match', async (event) => {
    render.currentScreen = render.screens.boardScreen
    render.configureWinner(event.winner)
})

socket.events.on('give-up-rejected', async (event) => {
    console.error(event)
})

// --> Config Events

config.events.on('configure-container', (container, board) => {
    render.receiveContainer(container, board)
    inputs.receiveContainer(container, board)
})

// --> Render Events


render.events.on('request-find-all-movements', (event) => {
    socket.findAllMovements()
})

render.events.on('request-move-piece', (event) => {
    socket.movePiece(event)
})

render.events.on('request-join-match', (event) => {
    socket.joinMatch()
})

render.events.on('request-give-up', (event) => {
    socket.giveUp()
})

// --> Language Events

language.events.on('update-language', (event) => {
    config.configureTitle(render.state)
    render.configureElements()
})

// --> Window Events

window.onload = function () {
    socket.receiveMatch(matchId)
    inputs.configureHandler()
}

window.onresize = function () {
    config.configureCanvas()
}

// --> Final File