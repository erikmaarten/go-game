Games = new Mongo.Collection("games");

/* Games:
{
  board: String of length 19*19
  boardWidth: Number // Represents the side of the board, 19 if board is 19*19
  status: String // one of "active", "ended"
  currentPlayer: Match.OneOf("black", "white")
  stonesCaptured: {
    black: Number,
    white: Number
  }
  history: [{
    type: String // one of: "placeStone", "pass", "resign"
    position: Number
  }]
  finalScore: {
    black: Number,
    white: Number
  }
}

*/