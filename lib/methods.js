Meteor.methods({
  createNewGame: function() {
    var playerId = Meteor.userId();
    var board = Game.newBoard();
    Games.insert({
      board: board, 
      status: "active", 
      blackPlayer: playerId,
      createdAt: Date.now()
    });
  },

  deleteGame: function() {
    Games.remove({status: "active"});
  }
});