// App component - represents the whole app
App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    var handle = Meteor.subscribe("games");
    var game = Games.findOne({status: "active"});
    if (game && game.board) {
      Session.set("board", Games.findOne({status: "active"}).board);
    }

    return {
      loading: ! handle.ready(),
      activeGame: Games.findOne({status: "active"})
    };
  },

  createNewGameSmall(event) {
    event.preventDefault();
    var size = 9;
    if (Meteor.userId()) {
      Meteor.call("createNewGame", size, function(error, result) {
        if (error) {console.log("error in createNewGame: " + error);}
      });
    } else {
      alert("Log in first!");
    }
  },

  createNewGameBig(event) {
    event.preventDefault();
    var size = 19;
    if (Meteor.userId()) {
      Meteor.call("createNewGame", size, function(error, result) {
        if (error) {console.log("error in createNewGame: " + error);}
      });
    } else {
      alert("Log in first!");
    }
  },

  handleClickDeleteGame(event) {
    event.preventDefault();
    if (Meteor.userId()) {
      Meteor.call("deleteGame", function(error, result) {
        if (error) {console.log("error in deleteGame: " + error);}
      });
    } else {
      alert("Log in first!");
    }
  },

  handleJoinGame(event) {
    event.preventDefault();
    if (Meteor.userId()) {
      Meteor.call("joinGame", function(error, result) {
        if (error) {console.log("error in joinGame: " + error);}
      });
    } else {
      alert("Log in first!");
    }
  },
 
  render() {
    if (this.data.loading) {
      return <p>Loading...</p>;
    }

    // 4 possibilities:
    // 1. There's no active game.
    if ( ! this.data.activeGame) {
      return (
        <div className="container">
          <header>
            <h1>Go</h1>
          </header>
          <button type="button" onClick={this.createNewGameBig}>New game (big)</button>
          <button type="button" onClick={this.createNewGameSmall}>New game (small)</button>
        </div>
      );
    // 2. This player created the game and is waiting for another player to join
    } else if (this.data.activeGame.players.length === 1 && 
      this.data.activeGame.players[0].userId === Meteor.userId()) {
      return (
        <div className="container">
          <header>
            <h1>Go</h1>
          </header>
          <h2>Waiting for player to join...</h2>
        </div>
      );
    // 3. There's a game waiting for another player to join, and this player may join
    } else if (this.data.activeGame.players.length === 1 &&
      this.data.activeGame.players[0].userId !== Meteor.userId()) {
      return (
        <div className="container">
          <header>
            <h1>Go</h1>
          </header>
          <button type="button" onClick={this.handleJoinGame}>Join game</button>
        </div>
      );
    // 4. There is an active game with 2 players already
    } else {
      return (
        <div className="container">
          <header>
            <h1>Go</h1>
          </header>
          <button type="button" onClick={this.handleClickDeleteGame}>Delete game</button>

          <GameInfo players={this.data.activeGame.players} 
            currentPlayer={this.data.activeGame.currentPlayer} />
          <GameActions currentPlayer={this.data.activeGame.currentPlayer} />
          <Board data={this.data.activeGame.board} players={this.data.activeGame.players} />
   
        </div>
      );
    }
  }
});
