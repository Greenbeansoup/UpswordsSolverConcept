const Trie = require('dawg-lookup').Trie
const fs = require('fs')
let fileUrl = "resources/Collins Scrabble Words (2019).txt"
// let fileUrl = "resources/ezDictionary.txt"
let boardUrl = "resources/Board.json"
let boardString = fs.readFileSync(boardUrl, "utf8")
const gameState = JSON.parse(boardString)
const checkBoard = new Map()
let trie = new Trie(fs.readFileSync(fileUrl, 'utf8'))
let packed = trie.pack()
const PTrie = require('dawg-lookup/lib/ptrie').PTrie
let ptrie = new PTrie(packed);
const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

// console.log(packed.split(';').join('\n'))
console.log(gameState.tiles)
console.log(gameState.board.rows)
console.log(gameState.board.positions[1][1].tile)

crossCheckRow(gameState.board.positions, 1, checkBoard)
console.log(checkBoard)

function crossCheckRow(board, row, checkBoard) {
    for (let col = 0; col < board[row].length; col++) {
        let rowRunner = row-1
        let prefix = ""
        while (rowRunner >= 0 && board[rowRunner][col].tile != "") {
            prefix = board[rowRunner][col].tile + prefix
            rowRunner--
        }
        rowRunner = row + 1
        let suffix = ""
        while (rowRunner < board.length && board[rowRunner][col].tile != "") {
            suffix = suffix + board[rowRunner][col].tile
            rowRunner++
        }

        console.log("prefix: " + prefix + ", suffix: " + suffix)

        alphabet.forEach(letter => {
            if (ptrie.isWord(prefix + letter + suffix)) {
                let location = {"row": row, "col": col}
                if (!checkBoard.has(location)) {
                    checkBoard.set(location, [letter])
                } else {
                    checkBoard.get(location).push(letter)
                }
            }
        })
    }
}

// console.log(legalLetters(gameState.board.positions, 1, 1, 1, gameState.tiles, ptrie))
//console.log(JSON.stringify(cullRow(gameState.board.positions, 2, gameState.tiles, ptrie)), null, 2)

/* const allRowMoves = []
for (let row = 0; row < gameState.board.rows; row++) {
    rowMoves = cullRow(gameState.board.positions, row, gameState.tiles, ptrie)
    if (rowMoves.length > 0) {
        allRowMoves.push(rowMoves)
    }
}
const allColMoves = []
for (let col = 0; col < gameState.board.columns; col++) {
    colMoves = cullColumn(gameState.board.positions, col, gameState.tiles, ptrie)
    if (colMoves.length > 0) {
        allColMoves.push(colMoves)
    }
}

const matchingMoves = []
allRowMoves.forEach(singleRowMoves => {
    console.log(singleRowMoves)
    allColMoves.forEach(singleColMoves => {
        solutionSingleRowMoves = []
        console.log(singleColMoves)
        singleRowMoves.forEach(rowMove => {
            singleColMoves.forEach(colMove => {
                //console.log(rowMove)
                //console.log(colMove)
                if(rowMove.row == colMove.row && rowMove.col == colMove.col) {
                    solutionLetters = []
                    rowMove.letters.forEach(rowLetter => {
                        colMove.letters.forEach(colLetter => {
                            if(rowLetter.tile == colLetter.tile) {
                                solutionLetters.push({"tile": rowLetter.tile, "points": rowLetter.points + colLetter.points})
                            }
                        })
                    })
                    if(solutionLetters.length > 0) {
                        solutionSingleRowMoves.push({"row": rowMove.row, "col": rowMove.col, "letters": solutionLetters})
                    }
                }
            })
        })
        if(solutionSingleRowMoves.length > 0) {
            matchingMoves.push(solutionSingleRowMoves)
        }
    })
})

console.log(matchingMoves)

console.log(JSON.stringify(matchingMoves))


function cullRow(boardState, row, tiles, ptrie) {
    const movesByColumn = []
    for (let column = 0; column < boardState.length; column++) {
        const letters = legalLetters(boardState, row, column, 1, tiles, ptrie)
        if (letters.length > 0) {
            movesByColumn.push({"row": row, "col": column, "letters": letters})
        }
    }
    return movesByColumn
}

function cullColumn(boardState, col, tiles, ptrie) {
    const movesByRow = []
    for (let row = 0; row < boardState.length; row++) {
        const letters = legalLetters(boardState, row, col, 0, tiles, ptrie)
        if (letters.length > 0) {
            movesByRow.push({"row": row, "col": col, "letters": letters})
        }
    }
    return movesByRow
}

function legalLetters(boardState, row, column, direction, tiles, ptrie) {
    const letters = []
    tiles.forEach(tile => {
        if (tile == boardState[row][column].tile) return;
        let word = ""
        let points = boardState[row][column].stack
        if (direction > 0) { // check vertical
            let runner = row - 1
            while (runner >= 0 && boardState[runner][column].tile != "") {
                word = boardState[runner][column].tile + word
                points += boardState[runner][column].stack
                runner--
            }
            runner = row + 1
            word = word + tile;
            points++; // the tile we're adding
            while (runner < boardState.length && boardState[runner][column].tile != "") {
                word = word + boardState[runner][column].tile
                points += boardState[runner][column].stack
                runner++
            } 
        } else { // horizantal
            let runner = column - 1
            while (runner >= 0 && boardState[row][runner].tile != "") {
                word = boardState[row][runner].tile + word
                points += boardState[row][runner].stack
                runner--
            }
            runner = column + 1
            word = word + tile;
            points++
            while (runner < boardState.length && boardState[row][runner].tile != "") {
                word = word + boardState[row][runner].tile
                points += boardState[row][runner].stack
                runner++
            } 
        }
        if (ptrie.isWord(word.toLowerCase())) {
            letters.push({"tile": tile, "points": points})
        }
    })
    console.log("Letters - row: " + row + " col: " + column + " ;; " + JSON.stringify(letters))
    return letters
} */