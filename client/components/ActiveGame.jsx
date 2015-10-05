/*globals ActiveGame:true, React, GameInfo, GameActions, Board */
ActiveGame = React.createClass({
  propTypes: {
    game: React.PropTypes.object.isRequired,
    isPlayer: React.PropTypes.bool.isRequired,
    playerColor: React.PropTypes.string.isRequired
  },

  render() {
    var roleDescription;
    if (this.props.playerColor === "white") {
      roleDescription = "Playing as white";
    } else if (this.props.playerColor === "black") {
      roleDescription = "Playing as black";
    } else {
      roleDescription = "Viewing game";
    }

    var game = this.props.game;
    var previousMove;
    if (game.history.length > 0) {
      previousMove = game.history[game.history.length-1];
    }
    return (
      <div id="main-container">
        <GameInfo currentPlayer={this.props.game.currentPlayer} />
        <div>
          <p><i>{roleDescription}</i></p>
          <Board data={this.props.game.board}
            gameStatus={this.props.game.status}
            playerColor={this.props.playerColor}
            currentPlayer={this.props.game.currentPlayer}
            previousMove={previousMove} />
        {this.props.isPlayer ? <GameActions playerColor={this.props.playerColor}
          currentPlayer={this.props.game.currentPlayer} />
          : ""}
        </div>
      </div>

    );
  }
});
