Meteor.methods({
  createNewGame: function() {
    var playerId = Meteor.userId();
    var board = Game.newBoard();
    Games.insert({
      board: board, 
      status: "active", 
      players: [{
        color: "black",
        userId: playerId
      }],
      createdAt: Date.now()
    });
  },

  deleteGame: function() {
    Games.remove({status: "active"});
  },

  insertStone: function(positionInString) {
    check(positionInString, Number);

    var currGame = Games.findOne({status: "active"});
    var players = currGame.players;
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

    var newBoard = currBoard.slice(0, positionInString) + stone + currBoard.slice(positionInString + 1);

    Games.update({_id: currentGameId}, {$set: {board: newBoard}});

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