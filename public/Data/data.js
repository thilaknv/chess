const themeSet = [
    ["#e9edcc", "#779954"]
]
let themeCode = 0;

const alpha = ["a", "b", "c", "d", "e", "f", "g", "h"];

function Square(color, id, piece) {
    return { color, id, piece };
}

function SquareRow(rowId) {
    const squareRow = [];
    const alpha = ["a", "b", "c", "d", "e", "f", "g", "h"];
    alpha.forEach((char, index) => {
        if ((rowId + index) % 2 == 0)
            squareRow.push(Square("white", `${char}${rowId}`));
        else
            squareRow.push(Square("black", `${char}${rowId}`));
    });
    return squareRow;
}

function initGame() {
    return [SquareRow(8), SquareRow(7), SquareRow(6), SquareRow(5), SquareRow(4), SquareRow(3), SquareRow(2), SquareRow(1)];
}

export {
    Square, SquareRow, initGame, alpha
}