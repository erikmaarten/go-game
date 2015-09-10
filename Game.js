Game = {};

Game.newBoard = function() {
  var board = "";
  for (var i = 0; i < 19*19; i++) {
    board += "0";
  }
  return board;
}

Game.update = function(position, color) {
  var currGame = Games.findOne({status: "active"});
  var currentGameId = currGame._id;
  var currBoard = currGame.board;

  var positionInString = position[0] * 19 + position[1];
  var stone = Game.stoneColorToType(color);

  var newBoard = currBoard.slice(0, positionInString) + stone + currBoard.slice(positionInString + 1);

  Games.update({_id: currentGameId}, {$set: {board: newBoard}});
}


Game.stoneColorToType = function(color) {
  if (color === "black") {
    return 1;
  } else if (color === "white") {
    return -1;
  } else {
    throw new Meteor.Error("Invalid argument");
  }
}