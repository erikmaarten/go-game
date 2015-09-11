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

// Return a list of intersections of same type connected to
// fromPosition
Game.getGroup = function(board, fromMatrixPosition) {
  var positionInString = Game.matrixPosToLinearPos(fromMatrixPosition);
  var inGroup = [];
  var checked = [];
  var toCheck = [positionInString];
  var intersectionType = board[positionInString];

  while (toCheck.length !== 0) {
    var currentPosition = toCheck.pop();
    var currentType = board[currentPosition];

    // Add position to checked array, so we don't check it again
    checked.push(currentPosition);

    // If the type is the same as the type we're looking for,
    // add position to inGroup
    if (currentType === intersectionType) {
      inGroup.push(currentPosition);
    } else {
      // Example: if looking for a black stone and this intersection
      // doesn't hold one, break to next step in loop
      continue;
    }

    _.chain([ 1, -1, BOARD_WIDTH, - BOARD_WIDTH ])
      .filter(function (step) {
        // filter out steps that are illegal
        // such as 19 - 1 or 18 + 1
        return !((currentPosition % 19 === 0 && step === -1) || 
          (currentPosition % 18 === 0 && step === 1));

      })
      .map(function(step) {
        // map to currentPosition's adjacent positions
        return currentPosition + step;
      })
      .filter(function(rawPos) {
        // filter out positions that are outside the board
        // The largest string index that represents a board position
        // is BOARD_WIDTH * BOARD_WIDTH - 1
        return !(rawPos < 0 || rawPos > BOARD_WIDTH * BOARD_WIDTH - 1);
      })
      .filter(function(rawPos) {
        // filter out the positions that have already been checked
        return (checked.indexOf(rawPos) === -1);
      }).each(function(pos) {
        if (toCheck.indexOf(pos) === -1) toCheck.push(pos);
      });
  }
  return inGroup;

}

Game.numberOfLiberties = function(board, position) {
  check(board, String);
  // 1. Get the positions belonging to a group
  // 2. For all the positions, check adjacent positions
  // for liberties
  // 3. return all unique liberties

  var positionsInGroup = Game.getGroup(board, position);
  return _.chain(positionsInGroup)
    .map(function(position) {
      // return all adjacent positions
      return Game.getAdjacentPositions(position);
    })
    .flatten()
    // Keep only unique positions
    .uniq()
    .map(function(uniqPosition) {
      // Count only positions that are libertis, == "0"
      return board[uniqPosition] === "0" ? 1 : 0;
    })
    .reduce(function(memo, num) {
      return memo + num;
    }, 0)
    .value();
}

Game.colorNameToStoneType = {
  black: 1,
  white: 2
};

Game.getAdjacentPositions = function(stringPos) {
  check(stringPos, Number);
  return _.chain([ 1, -1, BOARD_WIDTH, - BOARD_WIDTH ])
      .filter(function (step) {
        // filter out steps that cross horizontal board boundaries
        // such as 19 - 1 or 18 + 1
        return !((stringPos % 19 === 0 && step === -1) || 
          (stringPos % 18 === 0 && step === 1));

      })
      .map(function(step) {
        // map to currentPosition's adjacent positions
        return stringPos + step;
      })
      .filter(function(rawPos) {
        // filter out positions that are outside the board
        // The largest string index that represents a board position
        // is BOARD_WIDTH * BOARD_WIDTH - 1
        return !(rawPos < 0 || rawPos > BOARD_WIDTH * BOARD_WIDTH - 1);
      })
      .value();
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