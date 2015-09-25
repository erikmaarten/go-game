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
    return (
      <div id="main-container">
        <GameInfo currentPlayer={this.props.game.currentPlayer} />
        <div>
          <p><i>{roleDescription}</i></p>
          <Board data={this.props.game.board}
            gameStatus={this.props.game.status} 
            playerColor={this.props.playerColor}
            currentPlayer={this.props.game.currentPlayer} />
        {this.props.isPlayer ? <GameActions playerColor={this.props.playerColor} 
          currentPlayer={this.props.game.currentPlayer} />
          : ""}
        </div>
      </div>

    );
  }
});