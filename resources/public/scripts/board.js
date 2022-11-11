import { Emitter } from "./emitter.js"
import { Piece } from "./piece.js"

export function Board({columns, rows, parent}) {

    const emitter = Emitter()
    const pieces = new Array()

    function savePiece({column, row, piece}) {

        const validPosition = validatePosition({column, row})
        const isObjectPiece = piece instanceof Piece
        const pieceExists = getPiece({column, row})

        if (validPosition && isObjectPiece && !pieceExists) {
            pieces[row][column] = piece
            emitter.emit('save-piece', {column, row, piece})
        }

    }

    function removePiece({column, row}) {

        const validPosition = validatePosition({column, row})
        const pieceExists = getPiece({column, row})

        if (pieceExists && validPosition) {
            pieces[row][column] = null
            emitter.emit('remove-piece', {column, row, pieceExists})
        }

    }

    function getPiece({column, row}) {
        return pieces[row]?.[column]
    }

    function validatePosition({column, row}) {
        const validColumn = column >= 0 && column < columns
        const validRow = row >= 0 && row < rows
        return validColumn && validRow
    }

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

    function clone() {

        const clonedObject = Board({columns, rows, parent})

        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                const piece = getPiece({column, row})
                clonedObject.savePiece({column, row, piece})
            }
        }

        return clonedObject

    }

    const returnObject = {
        validatePosition,
        removePiece,
        savePiece,
        getPiece,
        listen,
        clone,
        pieces,
        columns,
        parent,
        rows
    }

    createPiecesArray()
    saveThisOnParent(returnObject)

    return returnObject

}