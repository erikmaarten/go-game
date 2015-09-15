Meteor.methods({
  createNewGame: function(size) {
    check(size, Number);

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
      }
    });
  },

  deleteGame: function() {
    Games.remove({status: "active"});
  },

  placeStone: function(matrixPos) {
    check(matrixPos, [Number]);

    var currGame = Games.findOne({status: "active"});
    var players = currGame.players;
    var boardWidth = currGame.boardWidth;
    var positionInString = Game.matrixPosToLinearPos(matrixPos, boardWidth);
    var userId = Meteor.userId();

    // Get the color of the current player
    var color = _.chain(players)
      .filter(function(player) {
        return player.userId === userId;
      })
      .map(function(player) {
        return player.color;
      })
      .value()[0];

    var currentGameId = currGame._id;
    var currBoard = currGame.board;
    var stone = Game.stoneColorToType(color);

    // Play flow:
    // 1. Insert stone if the following conditions hold: 
    //    a) it's this player's turn to play
    //    b) intersection is empty
    //    c) (TODO: implement differently) Make sure there are two players
    //      registered for the game, otherwise currentPlayer won't work
    // 2. Capture stones
    // 3. (TODO) Check for suicides?
    // 4. Set the other player to currentPlayer
    // 5. Save changes


    // check conditions before inserting stone stone
    // a)
    if (currBoard[positionInString] !== "0") {
      throw new Meteor.Error("non-empty_board_position", 
        "The board position was not empty, cannot insert new stone.");
    }

    // b)
    if (currGame.currentPlayer !== Meteor.userId()) {
      throw new Meteor.Error("not_your_turn", 
        "It's not your turn. Wait until the other player has played a stone.");
    }

    // c)
    if (currGame.players.length !== 2) {
      throw new Meteor.Error("game_is_missing_another_player", 
        "Another player needs to join the game before you can start playing.");
    }

    // Conditions OK, now insert stone
    var newBoard = currBoard.slice(0, positionInString) + 
      stone + currBoard.slice(positionInString + 1);

    // capture stones
    newBoard = Game.capture(newBoard, 
      Game.linearPosToMatrixPos(positionInString, boardWidth));

    // Check for suicides
    if (Game.countNumStones(currBoard, color) + 1 !== Game.countNumStones(newBoard, color)) {
      throw new Meteor.Error("suicide_not_allowed", 
        "Current rules do not permit capturing your own stones.");
    }

    // Get next player
    var nextPlayer = _.chain(players)
      .filter(function(player) {
        return player.userId !== userId;
      })
      .map(function(player) {
        return player.userId;
      })
      .value()[0];

    // Save changes
    Games.update({_id: currentGameId}, {$set: {board: newBoard, currentPlayer: nextPlayer}});

  },

  joinGame: function() {
    var activeGame = Games.findOne({status: "active"});
    var userId = Meteor.userId();
    if (userId && activeGame.players.length === 1) {
      console.log("adding player to game...");
      Games.update(
        {_id: activeGame._id}, 
        {$push: 
          {
            players: {
              color: "white",
              userId: userId
            }
          }
        }
      );
    }

  }
});