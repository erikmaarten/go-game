GameWaitingForPlayer = React.createClass({
  propTypes: {
    game: React.PropTypes.object.isRequired
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
        <p>{text}</p>
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