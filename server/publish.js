Meteor.publish("games", function() {
  return Games.find({});
});

Meteor.publish("allUsers", function() {
  if (this.userId) {
    return Meteor.users.find({});
  } else {
    return [];
  }

});