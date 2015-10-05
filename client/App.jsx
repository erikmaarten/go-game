/*globals App:true, headers, ActiveGame, EndedGame, OwnerChooseRole */
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
      return (<p>Loading...</p>);
    }

    var gameStatus = this.data.game.status;
    var permissionHeader = headers.get('X-Sandstorm-Permissions');
    var isPlayer = Permissions.isPlayer(permissionHeader);
    var playerColor = Permissions.getPlayerColor(permissionHeader);

    var usertype;

    if (Permissions.canChooseRole(permissionHeader)) {
      return <OwnerChooseRole />;
    }

    return (
      <div>
        {gameStatus === "active" ? <ActiveGame isPlayer={isPlayer}
          playerColor={playerColor} role={usertype}
          game={this.data.game} />
          : ""}
        {gameStatus === "ended" ? <EndedGame game={this.data.game}
          gameStatus={gameStatus} /> : ""}
      </div>
    );
  }
});
