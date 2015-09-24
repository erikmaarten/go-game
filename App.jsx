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
    var permissions = headers.get('X-Sandstorm-Permissions').split(",");
    var usertype;
    if (permissions.length === 1) {
      if (_.contains(permissions, "white_player")) {
        usertype = "white_player";
      } else if (_.contains(permissions, "black_player")) {
        usertype = "black_player";
      } else if (_.contains(permissions, "viewer")) {
        usertype = "viewer";
      }
    } else {
      // check if the current user is the grain owner/admin
      // by checking if the user has permission to play both white
      // and black. No other role will have that permission.
      // If the player is the owner, check if owner's role in game
      // is specified in the db. If unspecified, show a view where
      // the owner can choose a role.
      if (_.contains(permissions, "white_player") && 
        _.contains(permissions, "black_player")) {
        usertype = "owner";
        if (this.data.game.ownerRole) {
          var ownerRole = this.data.game.ownerRole;
          if (ownerRole === "white_player") {
            usertype = "white_player";
          } else if (ownerRole === "black_player") {
            usertype = "black_player";
          } else if (ownerRole === "viewer") {
            usertype = "viewer";
          }
        } else {
          return <OwnerChooseRole />;
        }
      }
    }

    var isPlayer = usertype === "white_player" || usertype === "black_player";
    var playerColor;
    if (usertype === "white_player") playerColor = "white";
    else if (usertype === "black_player") playerColor = "black";
    else playerColor = "none";

    return (
      <div className="container">
        {gameStatus === "active" ? 
          <div>
            <GameInfo currentPlayer={this.data.game.currentPlayer} />
            <Board data={this.data.game.board} usertype={usertype} 
              gameStatus={gameStatus} playerColor={playerColor}
              currentPlayer={this.data.game.currentPlayer} />
            {isPlayer ? 
              <GameActions playerColor={playerColor} 
                currentPlayer={this.data.game.currentPlayer} />
              : ""}
          </div>
          : ""}
        {gameStatus === "ended" ? <EndedGame game={this.data.game} gameStatus={gameStatus} /> : ""}
      </div>
    );
  }
});
