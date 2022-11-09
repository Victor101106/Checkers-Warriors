import { Emitter } from "./emitter.js"

export function Board({columns, rows, parent}) {

    const emitter = Emitter()
    const pieces = new Array()

    function createPiecesArray() {
        for (let row = 0; row < rows; row++) {
            pieces.push(new Array(columns))
        }
    }

    function saveThisOnParent(returnObject) {
        parent.state.board = returnObject
    }

    function listen(event, callback) {
        emitter.listen(event, callback)
    }

    const returnObject = {
        listen,
        columns,
        parent,
        pieces,
        rows
    }

    createPiecesArray()
    saveThisOnParent(returnObject)

    return returnObject

}