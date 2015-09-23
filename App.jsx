// App component - represents the whole app
App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    var handle = Meteor.subscribe("games");
    var game = Games.findOne();

    // Session var used for debugging
    if (game && game.board) {
      Session.set("board", game.board);
    }

    return {
      loading: ! handle.ready(),
      game: Games.findOne()
    };
  },

  componentDidUpdate() {
    GridCanvas.delayedRender();
  },

  render() {
    if (this.data.loading) {
      return <p>Loading...</p>;
    }

    var gameStatus = this.data.game.status;
    // TODO: check permissions and assign color!
    // TODO
    // TODO
    // TODO
    // TODO
    var playerColor = "white";

    return (
      <div className="container">
        {gameStatus === "active" ? 
          <div>
            <GameInfo currentPlayer={this.data.game.currentPlayer} />
            <Board data={this.data.game.board} playerColor={playerColor} 
              gameStatus={gameStatus} currentPlayer={this.data.game.currentPlayer} />
            <GameActions currentPlayer={this.data.game.currentPlayer} />
          </div>
          : ""}
        {gameStatus === "ended" ? <EndedGame game={this.data.endedGame} gameStatus={gameStatus} /> : ""}
      </div>
    );
  }
});
