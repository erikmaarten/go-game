BoardStates = [];

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

  deleteGame: function() {
    var game = Games.findOne({"players.userId": Meteor.userId()});
    // Only remove if the game found has the player in question
    // as the starting/creating player

    if (game) {
      BoardStates = [];
      Games.remove({_id: game._id});
    }
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
    // 4. Super ko rule applicable? If so, stop here
    // 5. Set the other player to currentPlayer
    // 6. Save changes


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
    var nextPlayer = _.chain(players)
      .filter(function(player) {
        return player.userId !== Meteor.userId();
      })
      .map(function(player) {
        return player.userId;
      })
      .value()[0];

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

    var currGame = Games.findOne({status: "active"});
    var players = currGame.players;
    if (currGame.currentPlayer !== Meteor.userId()) {
      throw new Meteor.Error("not_your_turn", "Cannot pass when it's not your turn.");
    } else {
      // Check for end-game condition if 
      // at least one move has been made
      // (game ends when both players pass consecutively)
      if (currGame.history.length >= 1 && 
          currGame.history[currGame.history.length-1].type === "pass") {
        // End game
        var changeRecord = {type: "pass"};
        var score = Game.getFinalScore(currGame.board);
        Games.update(
          {_id: currGame._id}, 
          {
            $set: {currentPlayer: "", status: "ended", finalScore: score},
            $push: {history: changeRecord}
        });
      } else {
        // Get next player
        var nextPlayer = _.chain(players)
          .filter(function(player) {
            return player.userId !== Meteor.userId();
          })
          .map(function(player) {
            return player.userId;
          })
          .value()[0];
        // Update currentPlayer
        var changeRecord = {type: "pass"};
        Games.update(
          {_id: currGame._id}, 
          {
            $set: {currentPlayer: nextPlayer},
            $push: {history: changeRecord}
        });
      }
    }
  },

  resign: function() {
    var currGame = Games.findOne({status: "active"});
    if (currGame.currentPlayer !== Meteor.userId()) {
      throw new Meteor.Error("not_your_turn", "Cannot resign when it's not your turn.");
    } else {
      var changeRecord = {type: "resign", player: Meteor.userId()};
      Games.update(
        {_id: currGame._id},
        {
          $set: {currentPlayer: "", status: "ended"},
          $push: {history: changeRecord}
        }
      );
    }
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