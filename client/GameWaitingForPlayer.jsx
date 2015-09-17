GameWaitingForPlayer = React.createClass({
  propTypes: {
    game: React.PropTypes.object.isRequired
  },

  // If game is waiting for another player to join,
  // the current player is either the player who started
  // or can join
  render() {
    var players = this.props.game.players;
    var text;
    if (players[0].userId === Meteor.userId()) {
      text = "Waiting for another player to join...";
    } else {
      text = "Press 'Join game' to play.";
    }
    return (
      <p>{{text}}</p>
      );
  }
  
});