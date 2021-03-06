// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let board = [];

  const fillBoard = function (board) {
    for (let i = 0; i < 8; i++) {
      let row = [];
      for (let j = 0; j < 8; j++) {
        row[j] = undefined;
      }
      board[i] = row;
    }
  };
  fillBoard(board);

  board[3][4] = new Piece('black');
  board[4][3] = new Piece('black');
  board[3][3] = new Piece('white');
  board[4][4] = new Piece('white');

  return board;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  
  let x, y;
  [x,y] = pos;

  if(x < 0 || x > 7 || y < 0 || y > 7) {
    return false;
  }
  return true;
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (this.isValidPos(pos)){
    return this.grid[pos[0]][pos[1]];
  }
  throw new Error('Not valid pos!');
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let piece = this.getPiece(pos);
  if (!this.isOccupied(pos)) {
    return false;
  } 
  return piece.color === color;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  if (this.getPiece(pos) === undefined) {
    return false;
  }

  return true;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip = []){
  let newPos = [pos[0] + dir[0], pos[1] + dir[1]];

  if (!this.isValidPos(newPos) || this.grid[newPos[0]][newPos[1]] === undefined) {
    return [];
  } else if (this.isMine(newPos, color)) {
    return piecesToFlip;
  }
  piecesToFlip.push(newPos);

  return this._positionsToFlip(newPos, color, dir, piecesToFlip);
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)){
    return false;
  }

  let directions = [[0,1], [-1,1], [-1,0], [0,-1], [-1,-1], [1,0], [1,1], [1,-1]];
  for(let i = 0; i < directions.length; i++) {
    if (this._positionsToFlip(pos, color, directions[i]).length > 0) {
      return true;
    }
  }
  return false;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (this.validMove(pos, color)){
    let directions = [[0, 1], [-1, 1], [-1, 0], [0, -1], [-1, -1], [1, 0], [1, 1], [1, -1]];
    for (let i = 0; i < directions.length; i++) {
      let currentPositions = this._positionsToFlip(pos, color, directions[i]);
      for(let i = 0; i < currentPositions.length; i++) {
        curPos = currentPositions[i];
        this.grid[curPos[0]][curPos[1]].flip();
      }  
    }
    this.grid[pos[0]][pos[1]] = new Piece(color);
  } else {
    throw new Error("Invalid move!");
  }
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  const moves = [];
  for(let i = 0; i < this.grid.length; i++) {
    for(let j = 0; j < this.grid[i].length; j++) {
      if(this.validMove([i,j], color)) {
        moves.push([i,j]);
      }
    }
  }
  return moves;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  if(this.validMoves(color).length === 0) {
    return false;
  }
  return true;
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  if(this.hasMove("black") || this.hasMove("white")) {
    return false;
  }
  return true;
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  console.log("-".repeat(15));
  for (let i = 0; i < this.grid.length; i++) {
    row = [];
    for (let j = 0; j < this.grid[i].length; j++) {
      if(this.grid[i][j] === undefined) {
        row.push(" ");
      } else {
        row.push(this.grid[i][j]);
      }
    }
    console.log(row.join("|"));
    console.log("-".repeat(15));
  }
};

Board.prototype.winner = function() {
  whiteCount = 0;
  blackCount = 0;

  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid[i].length; j++) {
      if(this.grid[i][j].color === 'white') {
        whiteCount++;
      } else if (this.grid[i][j].color === 'black') {
        blackCount++;
      }
    }
  }

  if(whiteCount > blackCount) {
    return "White";
  } else {
    return "Black";
  }

};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE