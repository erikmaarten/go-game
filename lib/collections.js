Games = new Mongo.Collection("games");

/* Games:
{
  board: String of length 19*19
  status: ["active", "finished"]
  players: [{
    color: String, 
    userId: Meteor.userId()
  }]
  currentPlayer: Meteor.userId()
  playerTurn: typeof Meteor.userId()
}

*/