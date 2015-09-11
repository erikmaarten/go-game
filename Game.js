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
        if (rawPos < 0 || rawPos > BOARD_WIDTH * BOARD_WIDTH - 1) {
          return false;
        } else {
          return true;
        }
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

Game.numberOfLiberties = function(preBoard, position, color) {
  check(preBoard, String);
  check(color, String);
  // 1. For all adjacent intersections to position,
  // if the intersection is empty, add 1 to liberties
  // if the intersection is of same color,
  // return its number of (uncounted) liberties and so on

  var initialPosition = Game.matrixPosToLinearPos(position);
  var boardString = preBoard.slice(0, initialPosition) + Game.colorNameToStoneType[color] +
    preBoard.slice(initialPosition + 1);

  var intersectionState = Game.colorNameToStoneType[color].toString();
  var visitedIntersections = [];
  // initial position visited
  visitedIntersections.push(Game.matrixPosToLinearPos(position));

  console.log("Starting numberOfLiberties. intersectionState: " + intersectionState);
  console.log("color: " + color + " stoneType: " + intersectionState);
  console.log("boardString: " + boardString);

  var recNumLiberties = function(pos, visited, intState) {
    return _.chain([ [0,1], [0,-1], [1,0], [-1,0] ])
      .map(function(step) {
        // map to adjacent positions to pos
        return [ pos[0] + step[0], pos[1] + step[1] ];
      })
      .filter(function(rawPos) {
        // filter out positions that are outside the board
        if (rawPos[0] < 0 || rawPos[0] >= BOARD_WIDTH || 
          rawPos[1] < 0 || rawPos[1] >= BOARD_WIDTH) {
          return false;
        } else {
          return true;
        }
      })
      .filter(function(rawPos) {
        // filter out the positions that have already been checked
        if (visited.indexOf(Game.matrixPosToLinearPos(rawPos)) === -1) {
          console.log("has _not_ visited: " + Game.matrixPosToLinearPos(rawPos));
        } else {
          console.log("has visited: " + Game.matrixPosToLinearPos(rawPos));
        }
        return (visited.indexOf(Game.matrixPosToLinearPos(rawPos)) === -1);
      })
      .map(function(validPosition) {
        // Now check the intersections
        // If state is same as the comparison, call this function
        // on that position
        // If state is empty (== 0), add one to liberties count

        // add position to visited positions
        visited.push(Game.matrixPosToLinearPos(validPosition));
        console.log("visitedIntersections: " + JSON.stringify(visited));

        // convert position to string position
        stringPos = Game.matrixPosToLinearPos(validPosition);

        console.log("validPosition: " + validPosition);

        if (boardString[stringPos] === intState) {
          return recNumLiberties(validPosition, visited, intState);
        } else if (boardString[stringPos] === "0") {
          console.log("added liberty");
          return 1;
        } else {
          return 0;
        }
      })
      .reduce(function(memo, num) {
        return memo + num;
      }, 0)
      .value();
  }

  return recNumLiberties(position, visitedIntersections, intersectionState);
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