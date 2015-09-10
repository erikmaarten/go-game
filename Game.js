Game = {};

Game.matrixPosToLinearPos = function(position) {
  return position[0] * BOARD_WIDTH + position[1];
}

Game.linearPosToMatrixPos = function(pos) {
  return [Math.floor(pos / BOARD_WIDTH), pos % BOARD_WIDTH];
}
Game.newBoard = function() {
  var board = "";
  for (var i = 0; i < BOARD_WIDTH*BOARD_WIDTH; i++) {
    board += "0";
  }
  return board;
}

Game.update = function(position) {
  var positionInString = this.matrixPosToLinearPos(position);
  Meteor.call("insertStone", positionInString, function(error, result) {
    if (error) {console.log("error in insertStone: " + error);}
  });
}

Game.numberOfLiberties = function(board, position, intersectionType) {
  // 1. For all adjacent intersections to position,
  // if the intersection is empty, add 1 to liberties
  // if the intersection is of same color,
  // return its number of (uncounted) liberties and so on

  var visitedIntersections = {};
  var numLiberties = 0;

  var recNumLiberties = function(position) {

  }
}

Game.colorNameToStoneType = {
  black: 1,
  white: 2
};

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