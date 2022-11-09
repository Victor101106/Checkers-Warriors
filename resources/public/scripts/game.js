import { Emitter } from "./emitter.js"
import { Player } from "./player.js"

export function Game() {

    const emitter = Emitter()
    const state = {
        players: new Array(),
        rules: new Object(),
        winner: undefined,
        board: undefined,
        turn: undefined,
    }

    function addPlayer(player) {

        const isObjectPlayer = player instanceof Player
        const hasLessTwoPlayers = state.players.length < 2
        
        if (isObjectPlayer && hasLessTwoPlayers) {
            state.players.push(player)
            emitter.emit('add-player', player)
        }
    }

    function getPlayerByTurn() {
        return state.players[state.turn]
    }

    function randomTurn() {
        const playerCount = state.players.length
        state.turn = Math.floor(Math.random() * playerCount)
    }

    function toggleTurn() {
        
        const playerCount = state.players.length - 1
        const turnNumber = state.turn || -1

        if (playerCount == turnNumber) {
            state.turn = 0
            return
        }

        state.turn = state.turn + 1
    }

    function setWinner(player) {

        const playerExists = state.players.find(
            playerFound => Object.is(player, playerFound)
        )

        if (playerExists) {
            state.winner = player
            state.turn = -1
            emitter.emit('set-winner', player)
        }
    }
    
    function setRule(newRule) {
        state.rules = {
            ...state.rules,
            ...newRule
        }
        emitter.emit('set-rule', newRule)
    }

    function getRule(rule) {
        return state.rules[rule]
    }

    function listen(event, callback) {
        emitter.listen(event, callback)
    }

    const returnObject = {
        getPlayerByTurn,
        toggleTurn,
        randomTurn,
        addPlayer,
        setWinner,
        setRule,
        getRule,
        listen,
        state
    }

    return returnObject

}