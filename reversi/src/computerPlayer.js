var readline = require("readline");


class ComputerPlayer {
  constructor(color, game) {
    this.color = color;
    this.playTurn = this.playTurn.bind(game);
  }

  playTurn(callback) {
    this.board.print();

    function getMove() {
      
      let moves = this.board.validMoves(this.currentPlayer.color);
      return moves[Math.floor(Math.random() * moves.length)];
    }

    let bindedGetMove = getMove.bind(this);
    let pos = bindedGetMove();

    this.board.placePiece(pos, this.currentPlayer.color);
    this._flipTurn();
    callback();
    
  }
}

if (typeof window === 'undefined') {
  module.exports = ComputerPlayer;
}