Permissions = {};
Permissions.getPermissions = function(permissionHeader) {
  check(permissionHeader, String);
  return permissionHeader.split(",");
}

Permissions.isOwner = function(permissionHeader) {
  check(permissionHeader, String);
  var perms = Permissions.getPermissions(permissionHeader);
  return _.contains(perms, "black_player") && 
    _.contains(perms, "white_player") &&
    _.contains(perms, "viewer");
}

// Return true if the current user is the
// Sandstorm grain owner and has not already chosen
// a role
Permissions.canChooseRole = function(permissionHeader) {
  check(permissionHeader, String);
  if (Permissions.isOwner(permissionHeader)) {
    var game = Games.findOne();
    if (game && !game.ownerRole) {
      return true;
    }
  }
  return false;
}

// Returns true only if the current user
// has access to play one of the colors, not both
Permissions.isPlayer = function(permissionHeader) {
  check(permissionHeader, String);
  if (Permissions.isOwner(permissionHeader)) {
    var game = Games.findOne();
    return (game && game.ownerRole) &&
      (game.ownerRole === "white_player" ||
      game.ownerRole === "black_player");
  } else {
    var perms = Permissions.getPermissions(permissionHeader);
    return (_.contains(perms, "black_player") && 
      !_.contains(perms, "white_player") ) 
    ||
    (_.contains(perms, "white_player") && 
      !_.contains(perms, "black_player") );
  }
}

Permissions.getPlayerColor = function(permissionHeader) {
  check(permissionHeader, String);
  if (Permissions.isOwner(permissionHeader)) {
    var game = Games.findOne();
    if (game && game.owerRole === "white_player") {
      return "white";
    } else if (game && game.ownerRole === "black_player") {
      return "black";
    }
  } else if (Permissions.isPlayer(permissionHeader)) {
    var perms = Permissions.getPermissions(permissionHeader);
    if (_.contains(perms, "white_player")) {
      return "white";
    } else if (_.contains(perms, "black_player")) {
      return "black";
    }
  } else {
    return "none";
  }
}