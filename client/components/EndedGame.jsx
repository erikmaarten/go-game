/*globals EndedGame:true, EndedGameWinnerText:true, Board,
  CapitalizeFirstLetter */
EndedGame = React.createClass({
  propTypes: {
    // We can use propTypes to indicate it is required
    game: React.PropTypes.object.isRequired,
    gameStatus: React.PropTypes.string.isRequired
  },

  render() {
    var history = this.props.game.history;
    var isResignedGame = history && history[history.length-1].type === "resign";
    var whoResigned;
    if (isResignedGame) {
      whoResigned = history[history.length-1].player;
    }

    return (
      <div id="main-container">
        <div>
          <div id="end-game-text">
          {isResignedGame ?
            <h2><i>{CapitalizeFirstLetter(whoResigned)} resigned.</i></h2>
            :
            <EndedGameWinnerText finalScore={this.props.game.finalScore} />
          }
          </div>
          <Board data={this.props.game.board} gameStatus={this.props.gameStatus}
            players={this.props.game.players} />
        </div>
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
      winnerText = "Black won the game.";
    } else if (score.white > score.black) {
      winnerText = "White won the game.";
    } else {
      winnerText = "The game was drawn.";
    }
    return (
      <div>
        <h2><i>{winnerText}</i></h2>
        <table>
          <tr><td>Black</td><td className="score">{score.black}</td></tr>
          <tr><td>White</td><td className="score">{score.white}</td></tr>
        </table>
      </div>
    );
  }
});
