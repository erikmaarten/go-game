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

  componentDidUpdate() {
    GridCanvas.delayedRender();
  },

  render() {
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

    var activeGame = this.data.activeGame;
    var showOldGame = !activeGame && this.data.endedGame ? true : false;
    var gameInProgress = activeGame && activeGame.players.length === 2;
    var isGameWaitingForPlayerJoin = activeGame && activeGame.players.length === 1;

    return (
      <div className="container">
        <AppHeader />
        <MetaActions game={game} />
        {gameInProgress ? 
          <div>
            <GameInfo players={this.data.activeGame.players} 
              currentPlayer={this.data.activeGame.currentPlayer} />
            <GameActions currentPlayer={this.data.activeGame.currentPlayer} />
            <Board data={this.data.activeGame.board} playerColor={playerColor} 
              players={this.data.activeGame.players} 
              currentPlayer={this.data.activeGame.currentPlayer} />
          </div>
          : ""}
        {isGameWaitingForPlayerJoin ? 
          <GameWaitingForPlayer game={this.data.activeGame} />
          : ""}
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
