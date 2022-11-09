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
        setRule,
        getRule,
        listen,
        state
    }

    return returnObject

}