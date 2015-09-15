Games = new Mongo.Collection("games");

/* Games:
{
  board: String of length 19*19
  boardWidth: Number // Represents the side of the board, 19 if board is 19*19
  status: ["active", "finished"]
  players: [{
    color: String, 
    userId: Meteor.userId()
  }]
  currentPlayer: Meteor.userId()
  playerTurn: typeof Meteor.userId()
  stonesCaptured: {
    black: Number,
    white: Number
  }
  history: [{
    type: String // one of: "placeStone", "pass"
    position: Number
  }]
}

*/