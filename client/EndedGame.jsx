EndedGame = React.createClass({
  propTypes: {
    // We can use propTypes to indicate it is required
    game: React.PropTypes.object.isRequired
  },

  render() {
    var score = this.props.game.finalScore;
    var winnerText = "";
    if (score.black > score.white) {
      winnerText = "Black won the game!";
    } else if (score.white > score.black) {
      winnerText = "White won the game!";
    } else {
      winnerText = "The game was drawn.";
    }
    return (
      <div>
        <h2>{winnerText}</h2>
        <p>Black: {score.black} points</p>
        <p>White: {score.white} points</p>
        <Board data={this.props.game.board} players={this.props.game.players} />
      </div>
    );
  }
});