if (Meteor.startup) {
  if (Games.find().count() === 0) {
    var boardWidth = process.env.GO_BOARD_WIDTH;
    console.log("env.GO_BOARD_WIDTH: " + boardWidth);
    if (!boardWidth) {
      throw new Meteor.Error("no_board_width_specified");
    } else {
      var board = Game.newBoard(boardWidth);
      Games.insert({
        board: board, 
        boardWidth: boardWidth,
        status: "active", 
        currentPlayer: "black",
        createdAt: Date.now(),
        stonesCaptured: {
          black: 0,
          white: 0
        },
        history: []
      });

      BoardStates = [];

    }
  }
}