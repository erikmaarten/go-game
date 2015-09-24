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

// Returns true only if the current user
// has access to play one of the colors, not both
Permissions.isPlayer = function(permissionHeader) {
  check(permissionHeader, String);
  if (Permissions.isOwner(permissionHeader)) {
    var game = Games.findOne();
    return game && 
      game.ownerRole === "white_player" ||
      game.ownerRole === "black_player";
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
    throw new Meteor.Error("no_color_for_non-player", 
      "Tried to get the player color, but the user is not a player");
  }
}