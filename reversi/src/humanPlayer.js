var readline = require("readline");
let rlInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

class HumanPlayer {
  constructor(color, game){
    this.color = color;
    this.playTurn = this.playTurn.bind(game);
  }

  playTurn (callback) {
    this.board.print();
    rlInterface.question(
      `${this.currentPlayer.color}, where do you want to move?`,
      handleResponse.bind(this)
    );

    function handleResponse(answer) {
      const pos = JSON.parse(answer);

      if (!this.board.validMove(pos, this.currentPlayer.color)) {
        console.log("Invalid move!");
        this.currentPlayer.playTurn(callback);
        return;
      }

      this.board.placePiece(pos, this.currentPlayer.color);
      this._flipTurn();
      callback();
    } 
  }
}

if (typeof window === 'undefined') {
  module.exports = HumanPlayer;
}