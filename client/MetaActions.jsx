MetaActions = React.createClass({
  propTypes: {
    game: React.PropTypes.object
  },

  createNewGameSmall(event) {
    event.preventDefault();
    var size = 9;
    if (Meteor.userId()) {
      Meteor.call("createNewGame", size, function(error, result) {
        if (error) {console.log("error in createNewGame: " + error);}
        else {
          GridCanvas.delayedRender();
        }
      });
    } else {
      alert("Log in first!");
    }
  },

  createNewGameBig(event) {
    event.preventDefault();
    var size = 19;
    if (Meteor.userId()) {
      Meteor.call("createNewGame", size, function(error, result) {
        if (error) {console.log("error in createNewGame: " + error);}
        else {
          GridCanvas.delayedRender();
        }
      });
    } else {
      alert("Log in first!");
    }
  },

  handleClickDeleteGame(event) {
    event.preventDefault();
    if (Meteor.userId()) {
      Meteor.call("deleteGame", function(error, result) {
        if (error) {console.log("error in deleteGame: " + error);}
        else {
          GridCanvas.delayedRender();
        }
      });
    } else {
      alert("Log in first!");
    }
  },

  handleJoinGame(event) {
    event.preventDefault();
    if (Meteor.userId()) {
      Meteor.call("joinGame", function(error, result) {
        if (error) {console.log("error in joinGame: " + error);}
        else {
          GridCanvas.delayedRender();
        }
      });
    } else {
      alert("Log in first!");
    }
  },

  render() {

    var game = this.props.game;
    var gameExists = game ? true : false;
    var isGameActive = gameExists && game.status === "active";
    var canJoin = gameExists && isGameActive ? game.players.length === 1 &&
      game.players[0].userId !== Meteor.userId() : false;

    var canDelete = gameExists && game.status !== "active" ? game.players[0].userId === Meteor.userId()
      : false;
    var canCreate = !gameExists || (gameExists && !isGameActive);

    return (
      <div>
        <button type="button" onClick={this.handleJoinGame} disabled={!canJoin}>
          Join game
        </button>
        <button type="button" onClick={this.handleClickDeleteGame} disabled={!canDelete}>
          Delete game
        </button>
        <button type="button" onClick={this.createNewGameBig} disabled={!canCreate}>
          New game (19x19)
        </button>
        <button type="button" onClick={this.createNewGameSmall} disabled={!canCreate}>
          New game (9x9)
        </button>
      </div>
    );
  }

});