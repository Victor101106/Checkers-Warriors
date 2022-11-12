export function Line({startsAt, direction, board}) {
    
    const positions = new Array()

    let column = startsAt.column + direction.x
    let row = startsAt.row + direction.y

    if (!direction.x && !direction.y) {
        return []
    }

    while (board.validatePosition({column, row})) {

        positions.push({
            piece: board.getPiece({column, row}),
            column, 
            row
        })

        column += direction.x
        row += direction.y

    }

    return positions

}