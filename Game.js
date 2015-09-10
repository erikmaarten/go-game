Game = {};

Game.newBoard = function() {
  var board = "";
  for (var i = 0; i < 19*19; i++) {
    board += "0";
  }
  return board;
}

Game.update = function(position) {
  console.log("position in Game.update: " + position.length);
  var positionInString = position[0] * 19 + position[1];
  Meteor.call("insertStone", positionInString, function(error, result) {
    if (error) {console.log("error in insertStone: " + error);}
  });
}


Game.stoneColorToType = function(color) {
  check(color, String);
  if (color === "black") {
    return 1;
  } else if (color === "white") {
    return 2;
  } else {
    throw new Meteor.Error("Invalid argument");
  }
}