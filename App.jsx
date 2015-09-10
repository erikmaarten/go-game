// App component - represents the whole app
App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    var handle = Meteor.subscribe("games");

    return {
      loading: ! handle.ready(),
      activeGame: Games.findOne({status: "active"})
    };
  },

  getGame() {
    return this.data.activeGame;
  },

 
  renderGame() {
    return this.data.activeGame.board;
  },

  handleClickNewGame(event) {
    event.preventDefault();
    if (Meteor.userId()) {
      Meteor.call("createNewGame", function(error, result) {
        if (error) {console.log("error in createNewGame: " + error);}
      });
    }
  },

  handleClickDeleteGame(event) {
    event.preventDefault();
    if (Meteor.userId()) {
      Meteor.call("deleteGame", function(error, result) {
        if (error) {console.log("error in deleteGame: " + error);}
      });
    }
  },
 
  render() {
    if (this.data.loading) {
      return <p>Loading...</p>;
    }

    if (!this.data.activeGame) {
      return (
        <div className="container">
          <header>
            <h1>Go</h1>
          </header>

          <button type="button" onClick={this.handleClickNewGame}>New game</button>
        </div>
      );
    }

    return (
      <div className="container">
        <header>
          <h1>Go</h1>
        </header>

        <button type="button" onClick={this.handleClickNewGame}>New game</button>
        <button type="button" onClick={this.handleClickDeleteGame}>Delete game</button>
        <Board data={this.data.activeGame.board} />
 
      </div>
    );
  }
});
