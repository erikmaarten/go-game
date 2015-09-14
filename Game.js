Game = {};

Game.countNumStones = function(board, color) {
  var stone = Game.stoneColorToCharacter(color);
  // A bit excessive in memory usage, but fast
  // Creates and allocates memory for each array created,
  // resulting in at most 19 * 19 array allocs
  return board.split(stone).length - 1;
}

Game.matrixPosToLinearPos = function(position) {
  return position[0] * BOARD_WIDTH + position[1];
}

Game.linearPosToMatrixPos = function(pos) {
  check(pos, Number);
  return [Math.floor(pos / BOARD_WIDTH), pos % BOARD_WIDTH];
}
Game.newBoard = function() {
  var board = "";
  for (var i = 0; i < BOARD_WIDTH*BOARD_WIDTH; i++) {
    board += "0";
  }
  return board;
}

Game.placeStone = function(position) {
  var positionInString = this.matrixPosToLinearPos(position);
  Meteor.call("placeStone", positionInString, function(error, result) {
    if (error) {console.log("error in insertStone: " + error);}
  });
}

Game.capture = function(board, playedPosition) {
  check(board, String);
  check(playedPosition, [Number]);
  // Perform capture (done after a stone has been played)
  // Note that suicide is not prohibited according to most rulesets
  // However, the capture function does ensure validity. Instead,
  // Game.validatePlay() does validation

  // 1. Fetch all adjacent positions to the playedPosition
  // 2. For all of the opponent's stones in those positions, 
  // check if any have zero liberties. If so, remove the whole group that those 
  // stones belong to
  // 3. For all of your own stones in those positions, remove those
  //  with zero liberties. If there are any, this move is not legal
  //  but that concern is handled elsewhere.

  var stringPos = Game.matrixPosToLinearPos(playedPosition);
  var adjacent = Game.getAdjacentPositions(stringPos);
  var playerType = board[stringPos];

  // Capture opponent's stones
  var capturedPositions = _.chain(adjacent)
    .filter(function(position) {
      // return only intersections that the opponent currently holds
      return board[position] !== "0" && board[position] !== playerType;
    })
    .filter(function(position) {
      // return only positions where stones have zero liberties
      var matrixPos = Game.linearPosToMatrixPos(position);
      return Game.numberOfLiberties(board, matrixPos) === 0;
    })
    .map(function(position) {
      // return the groups that the positions belong to
      var matrixPos = Game.linearPosToMatrixPos(position);
      //console.log("Game.getGroup: " + JSON.stringify(Game.getGroup(board, matrixPos)));
      return Game.getGroup(board, matrixPos);
    })
    .flatten()
    .uniq()
    .value();

  var cleanedBoard = board;
  _.each(capturedPositions, function(position) {
    cleanedBoard = cleanedBoard.slice(0, position) + "0" + cleanedBoard.slice(position + 1);
  });

  // Self-capture
  // Same as above except that it includes the position being played
  // but capturing the current player's stones
  // TODO: the logic could be extracted and put in a separate function
  // to be reused by both capture modes

  // Add the played position to intersections to check for suicides
  adjacent.push(stringPos);
  var capturedPositions = _.chain(adjacent)
    .filter(function(position) {
      // return only intersections that the opponent currently holds
      return board[position] === playerType;
    })
    .filter(function(position) {
      // return only positions where stones have zero liberties
      var matrixPos = Game.linearPosToMatrixPos(position);
      return Game.numberOfLiberties(board, matrixPos) === 0;
    })
    .map(function(position) {
      // return the groups that the positions belong to
      var matrixPos = Game.linearPosToMatrixPos(position);
      //console.log("Game.getGroup: " + JSON.stringify(Game.getGroup(board, matrixPos)));
      return Game.getGroup(board, matrixPos);
    })
    .flatten()
    .uniq()
    .value();

  _.each(capturedPositions, function(position) {
    cleanedBoard = cleanedBoard.slice(0, position) + "0" + cleanedBoard.slice(position + 1);
  });

  return cleanedBoard;
}

// Return a list of intersections of same type connected to
// fromPosition
Game.getGroup = function(board, fromMatrixPosition) {
  check(board, String);
  check(fromMatrixPosition, [Number]);

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

    // Get all adjacent positions. If they are already checked,
    // filter out. If not checked, and if not in the list toCheck,
    // add to toCheck so that a future iteration will check that position.
    _.chain(Game.getAdjacentPositions(currentPosition))
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
  check(position, [Number]);
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
          ( (stringPos + 1) % 19 === 0 && step === 1));

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

Game.stoneColorToCharacter = function(color) {
  check(color, String);
  if (color === "black") {
    return "1";
  } else if (color === "white") {
    return "2";
  } else {
    throw new Meteor.Error("Invalid argument");
  }
}