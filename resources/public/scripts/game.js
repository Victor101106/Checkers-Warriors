import { Emitter } from "./emitter.js"

export function Game() {

    const emitter = Emitter()
    const state = {
        players: new Array(),
        rules: new Object(),
        winner: undefined,
        board: undefined,
        turn: undefined,
    }

    function listen(event, callback) {
        emitter.listen(event, callback)
    }

    const returnObject = {
        listen,
        state
    }

    return returnObject

}