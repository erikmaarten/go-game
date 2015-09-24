Meteor.methods({
  setOwnerRole: function(role) {
    // First make sure the user is actually the grain owner
    var perms = headers.get(this, 'X-Sandstorm-Permissions').split(",");
    if (_.contains(perms, "black_player") && _.contains(perms, "white_player") &&
      _.contains(perms, "viewer")) {
      var game = Games.findOne();
      Games.update({_id: game._id}, {$set: {ownerRole: role}});
    }
  }
});