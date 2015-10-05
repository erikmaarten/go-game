/*globals Flash:true, $, Meteor */
Flash = {};

var timer;
Flash.setNew = function (html) {
  $('#flash-messages').html("");
  Meteor.setTimeout(function() {
    $('#flash-messages').html(html);
  }, 200);

  if (timer) {
    Meteor.clearTimeout(timer);
  }

  timer = Meteor.setTimeout(function() {
    $('#flash-messages').html("");
  }, 5000);
};

Flash.warning = function(message) {
  var content = "<span class='warning'>" + message + "</span>";
  this.setNew(content);
};

Flash.error = function(message) {
  var content = "<span class='error'>" + message + "</span>";
  this.setNew(content);
};
Flash.info = function(message) {
  var content = "<span class='info'>" + message + "</span>";
  this.setNew(content);
};
Flash.success = function(message) {
  var content = "<span class='success'>" + message + "</span>";
  this.setNew(content);
};
