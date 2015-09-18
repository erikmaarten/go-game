EndedGame = React.createClass({
  propTypes: {
    // We can use propTypes to indicate it is required
    game: React.PropTypes.object.isRequired
  },

  render() {
    var history = this.props.game.history;
    var isResignedGame = history && history[history.length-1].type === "resign";
    var players = this.props.game.players;
    var whoResigned;
    if (isResignedGame) {
      whoResigned = _.chain(players)
        .filter(function(player) {
          return player.userId === history[history.length-1].player;
        })
        .map(function(player) {
          return player.color;
        })
        .value()[0];
    }

    return (
      <div>
        {isResignedGame ? 
          <h2>{whoResigned} resigned</h2>
          :
          <EndedGameWinnerText finalScore={this.props.game.finalScore} />
        }
        <Board data={this.props.game.board} players={this.props.game.players} />
      </div>
    );
  }
});

EndedGameWinnerText = React.createClass({
  propTypes: {
    finalScore: React.PropTypes.object.isRequired
  },

  render() {
    var score = this.props.finalScore;
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
      </div>
    );
  }
});