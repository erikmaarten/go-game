GameWaitingForPlayer = React.createClass({
  propTypes: {
    game: React.PropTypes.object.isRequired
  },

  cancelGame(event) {
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

  // If game is waiting for another player to join,
  // the current player is either the player who started
  // or can join
  render() {
    var players = this.props.game.players;
    var playerStartedGame = players[0].userId === Meteor.userId();
    var text = playerStartedGame ? "Waiting for another player to join..."
      : "Press 'Join game' to play.";
    return (
      <div className="loading-with-text">
        <p>{text} {playerStartedGame ? 
          <button type="button" onClick={this.cancelGame} >cancel</button> : ""}
        </p>
        {playerStartedGame ? <LoadingSpinner /> : ""}
      </div>
      );
  }
  
});

LoadingSpinner = React.createClass({
  render() {
    return (
      <div className="loading-spinner"></div>
      );
  }
});