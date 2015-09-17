// App component - represents the whole app
App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    var handle = Meteor.subscribe("games");
    var game = Games.findOne({status: "active"});
    var oldGame = Games.findOne({status: "ended"});
    if (game && game.board) {
      Session.set("board", game.board);
    } else if (oldGame && oldGame.board) {
      Session.set("board", oldGame.board);
    }

    return {
      loading: ! handle.ready(),
      activeGame: Games.findOne({status: "active"}),
      endedGame: Games.findOne({status: "ended"})
    };
  },

  render() {
    // Canvas must be updated, so that if the board position changes,
    // the canvas background is changed too
    GridCanvas.delayedRender();

    if (this.data.loading) {
      return <p>Loading...</p>;
    }

    var playerColor, game;
    if (this.data.activeGame) game = this.data.activeGame;
    else if (this.data.endedGame) game = this.data.endedGame;

    if (game) {
      playerColor = _.chain(game.players)
        .filter(function(player) {
          return player.userId === Meteor.userId();
        })
        .map(function(player) {
          return player.color;
        })
        .value()[0];
    }

    var showOldGame = !this.data.activeGame ? true : false;
    var gameInProgress = this.data.activeGame && this.data.activeGame.players.length === 2;

    return (
      <div className="container">
        <AppHeader />
        <MetaActions game={game} />
        {gameInProgress ? <GameInfo players={this.data.activeGame.players} 
          currentPlayer={this.data.activeGame.currentPlayer} />
          : ""}
        {gameInProgress ? <GameActions currentPlayer={this.data.activeGame.currentPlayer} />
          : ""}
        {gameInProgress ? <Board data={this.data.activeGame.board} playerColor={playerColor} 
          players={this.data.activeGame.players} /> : ""}
        {showOldGame ? <EndedGame game={this.data.endedGame} /> : ""}
      </div>
    );
  }
});

AppHeader = React.createClass({
  render() {
    return (
        <header>
          <h1>Go</h1>
        </header>
      );
  }
});
