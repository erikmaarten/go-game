/*globals Game, headers */
var BoardStates = [];

Meteor.methods({
  createNewGame: function(size) {
    check(size, Number);
    // Disallow creating a new game when there's already an active
    // game
    if (Games.find({status: "active"}).count() > 0) {
      return;
    }

    var playerId = Meteor.userId();
    var board = Game.newBoard(size);
    Games.insert({
      board: board,
      boardWidth: size,
      status: "active",
      players: [{
        color: "black",
        userId: playerId
      }],
      currentPlayer: playerId,
      createdAt: Date.now(),
      stonesCaptured: {
        black: 0,
        white: 0
      },
      history: []
    });

    BoardStates = [];
  },

  placeStone: function(matrixPos) {
    check(matrixPos, [Number]);
    var permissionHeader;
    if (Meteor.isServer) {
      permissionHeader = headers.get(this, 'X-Sandstorm-Permissions');
    } else {
      permissionHeader = headers.get('X-Sandstorm-Permissions');
    }

    // Check if the current user is a player
    // if not, throw error
    if (! Permissions.isPlayer(permissionHeader) ) {
      throw new Meteor.Error("user_is_not_player");
    }

    var currGame = Games.findOne({status: "active"});
    var boardWidth = currGame.boardWidth;
    var positionInString = Game.matrixPosToLinearPos(matrixPos, boardWidth);

    // Get the color of the current player
    var color = Permissions.getPlayerColor(permissionHeader);

    var currentGameId = currGame._id;
    var currBoard = currGame.board;
    var stone = Game.stoneColorToType(color);

    // Play flow:
    // 1. Insert stone if the following conditions hold:
    //    a) it's this player's turn to play
    //    b) intersection is empty
    // 2. Capture stones
    // 3. (TODO) Check for suicides?
    // 4. Super ko rule applicable? If so, stop here
    // 5. Set the other player to currentPlayer
    // 6. Save changes


    // check conditions before inserting stone stone
    // a)
    if (currGame.currentPlayer !== color) {
      return STATUS.not_your_turn;
    }

    // b)
    if (currBoard[positionInString] !== "0") {
      throw new Meteor.Error("non-empty_board_position",
        "The board position was not empty, cannot insert new stone.");
    }

    // Conditions OK, now insert stone
    var newBoard = currBoard.slice(0, positionInString) +
      stone + currBoard.slice(positionInString + 1);

    // 2. capture stones
    newBoard = Game.capture(newBoard,
      Game.linearPosToMatrixPos(positionInString, boardWidth));

    // 3. Check for suicides
    if (Game.countNumStones(currBoard, color) + 1 !== Game.countNumStones(newBoard, color)) {
      return STATUS.suicide_illegal;
    }

    // 4. Super ko rule
    // First make sure boardStates not empty
    // If empty, it could mean the server has been started
    // in the middle of a game, so we need to recreate the past
    // game states
    if (BoardStates.length === 0) {
      BoardStates = Game.recreateBoardPositions(currGame.history, currGame.boardWidth);
    }
    if (BoardStates.indexOf(newBoard) !== -1) {
      return STATUS.superko_violation;
    } else {
      BoardStates.push(newBoard);
    }

    // Get next player
    var nextPlayer = currGame.currentPlayer === "black" ? "white" : "black";

    // Save changes
    var changeRecord = {
      type: "placeStone",
      color: color,
      position: positionInString
    };
    Games.update(
      {_id: currentGameId},
      {
        $set: {board: newBoard, currentPlayer: nextPlayer},
        $push: {history: changeRecord}
    });

    return STATUS.move_ok;
  },

  pass: function() {
    // If last move was a pass too, end game,
    // otherwise change currentPlayer to the other player

    var permissionHeader, changeRecord;
    if (Meteor.isServer) {
      permissionHeader = headers.get(this, 'X-Sandstorm-Permissions');
    } else {
      permissionHeader = headers.get('X-Sandstorm-Permissions');
    }

    var currGame = Games.findOne({status: "active"});
    if (!currGame) {
      throw new Meteor.Error("no_active_game",
        "There's no active game, can't pass.");
    }

    // make sure the current user has permission to play
    if (! Permissions.isPlayer(permissionHeader) ) {
      throw new Meteor.Error("no_permission_to_play");
    }

    // check if it's this player's turn
    if (currGame.currentPlayer !== Permissions.getPlayerColor(permissionHeader)) {
      throw new Meteor.Error("not_your_turn",
        "Cannot pass when it's not your turn.");
    }

    // Check for end-game condition if
    // at least one move has been made
    // (game ends when both players pass consecutively)
    if (currGame.history.length >= 1 &&
        currGame.history[currGame.history.length-1].type === "pass") {
      // End game
      changeRecord = {type: "pass"};
      var score = Game.getFinalScore(currGame.board);
      Games.update(
        {_id: currGame._id},
        {
          $set: {currentPlayer: "", status: "ended", finalScore: score},
          $push: {history: changeRecord}
      });
    } else {
      // Get next player and then update
      // and add new history record
      var nextPlayer = currGame.currentPlayer === "black" ? "white" : "black";
      changeRecord = {type: "pass"};
      Games.update(
        {_id: currGame._id},
        {
          $set: {currentPlayer: nextPlayer},
          $push: {history: changeRecord}
      });
    }
  },

  resign: function() {
    var currGame = Games.findOne({status: "active"});
    var permissionHeader;
    if (Meteor.isServer) {
      permissionHeader = headers.get(this, 'X-Sandstorm-Permissions');
    } else {
      permissionHeader = headers.get('X-Sandstorm-Permissions');
    }

    if (! Permissions.isPlayer(permissionHeader) ) {
      throw new Meteor.Error("user_is_not_player");
    }

    if (currGame.currentPlayer !== Permissions.getPlayerColor(permissionHeader)) {
      throw new Meteor.Error("not_your_turn", "Cannot resign when it's not your turn.");
    } else {
      var playerColor = Permissions.getPlayerColor(permissionHeader);
      var changeRecord = {type: "resign", player: playerColor};
      Games.update(
        {_id: currGame._id},
        {
          $set: {currentPlayer: "", status: "ended"},
          $push: {history: changeRecord}
        }
      );
    }
  }
});
