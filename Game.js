Game = {};

Game.debugPrintCurrent = function() {
  console.log(Games.findOne({status: "active"}).board);
}

Game.getEmptyGroups = function(board) {
  var intersections = [];
  var emptyGroups = [];
  for (var i = 0; i < board.length; i++) {
    intersections.push(i);
  };
  while (intersections.length !== 0) {
    var positionInString = intersections.pop();

    // If the position is not empty, i.e. represents a stone,
    // do not get its group (we're only looking for empty groups)
    if (board[positionInString] !== "0") {
      continue;
    } else {
      // Get the group that the current position belongs to
      // then remove all intersections in that group from the intersections
      // that still are to be checked
      var matrixPos = Game.linearPosToMatrixPos(positionInString, Game.getBoardWidth(board));
      var g = Game.getGroup(board, matrixPos);
      intersections = _.difference(intersections, g);
      emptyGroups.push(g);
    }
  }

  return emptyGroups;
}

Game.getFinalScore = function(board) {
  check(board, String);

  var score = {
    black: 0,
    white: 0
  };
  var boardWidth = Game.getBoardWidth(board);

  // 1. Get all empty groups
  // 2. For each empty group, check if that group has adjacent stones
  // of only one type. If so, the group belongs to that player, then add 
  // the group's intersection count to to score of that player
  // 3. Count the number of stones on the board for each player, and add
  // to their scores

  // 1
  var emptyGroups = Game.getEmptyGroups(board);

  // 2
  _.each(emptyGroups, function(group) {
    var numBlack = 0;
    var numWhite = 0;
    // Go through each position in the group
    // get adjacent, check their color
    _.each(group, function(posInString) {
      var adjacent = Game.getAdjacentPositions(posInString, boardWidth);
      _.each(adjacent, function(adjPos) {
        adjType = board[adjPos];
        if (adjType === BLACK_STONE) numBlack += 1; 
        else if (adjType === WHITE_STONE) numWhite += 1; 
      });
    });

    // If there were adjacent stones of only one color, count group
    // to that player's score
    if (numBlack > 0 && numWhite === 0) {
      score.black += group.length;
    } else if (numWhite > 0 && numBlack === 0) {
      score.white += group.length;
    }
  });

  // 3
  score.black += Game.countNumStones(board, "black");
  score.white += Game.countNumStones(board, "white");

  return score;
}

Game.countNumStones = function(board, color) {
  var stone = Game.stoneColorToCharacter(color);
  // A bit excessive in memory usage, but fast
  // Creates and allocates memory for each array created,
  // resulting in at most 19 * 19 array allocs
  return board.split(stone).length - 1;
}

Game.getBoardWidth = function(board) {
  check(board, String);
  var width = Math.sqrt(board.length);
  if (width === Math.round(width)) {
    return width;
  } else {
    throw new Meteor.Error("invalid_board_width");
  }
}

Game.matrixPosToLinearPos = function(position, boardWidth) {
  check(position, [Number]);
  check(boardWidth, Number);
  return position[0] * boardWidth + position[1];
}

Game.linearPosToMatrixPos = function(pos, boardWidth) {
  check(pos, Number);
  check(boardWidth, Number);
  return [Math.floor(pos / boardWidth), pos % boardWidth];
}
Game.newBoard = function(width) {
  var board = "";
  for (var i = 0; i < width*width; i++) {
    board += "0";
  }
  return board;
}

Game.placeStone = function(position) {
  Meteor.call("placeStone", position, function(error, result) {
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

  var boardWidth = Game.getBoardWidth(board);
  var stringPos = Game.matrixPosToLinearPos(playedPosition, boardWidth);
  var adjacent = Game.getAdjacentPositions(stringPos, boardWidth);
  var playerType = board[stringPos];

  // Capture opponent's stones
  var capturedPositions = _.chain(adjacent)
    .filter(function(position) {
      // return only intersections that the opponent currently holds
      return board[position] !== "0" && board[position] !== playerType;
    })
    .filter(function(position) {
      // return only positions where stones have zero liberties
      var matrixPos = Game.linearPosToMatrixPos(position, boardWidth);
      return Game.numberOfLiberties(board, matrixPos) === 0;
    })
    .map(function(position) {
      // return the groups that the positions belong to
      var matrixPos = Game.linearPosToMatrixPos(position, boardWidth);
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
      var matrixPos = Game.linearPosToMatrixPos(position, boardWidth);
      return Game.numberOfLiberties(board, matrixPos) === 0;
    })
    .map(function(position) {
      // return the groups that the positions belong to
      var matrixPos = Game.linearPosToMatrixPos(position, boardWidth);
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

  var boardWidth = Game.getBoardWidth(board);
  var positionInString = Game.matrixPosToLinearPos(fromMatrixPosition, boardWidth);
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
    _.chain(Game.getAdjacentPositions(currentPosition, boardWidth))
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
  var boardWidth = Game.getBoardWidth(board);
  return _.chain(positionsInGroup)
    .map(function(position) {
      // return all adjacent positions
      return Game.getAdjacentPositions(position, boardWidth);
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

Game.getAdjacentPositions = function(stringPos, boardWidth) {
  check(stringPos, Number);
  check(boardWidth, Number);
  return _.chain([ 1, -1, boardWidth, - boardWidth ])
      .filter(function (step) {
        // filter out steps that cross horizontal board boundaries
        // such as 19 - 1 or 18 + 1
        return !((stringPos % boardWidth === 0 && step === -1) || 
          ( (stringPos + 1) % boardWidth === 0 && step === 1));

      })
      .map(function(step) {
        // map to currentPosition's adjacent positions
        return stringPos + step;
      })
      .filter(function(rawPos) {
        // filter out positions that are outside the board
        // The largest string index that represents a board position
        // is BOARD_WIDTH * BOARD_WIDTH - 1
        return !(rawPos < 0 || rawPos > boardWidth * boardWidth - 1);
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