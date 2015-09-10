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
    let board = Game.new();
    Games.insert({
      board: board, 
      status: "active",
      createdAt: new Date()
    });
  },
 
  render() {
    if (this.data.loading) {
      return <p>Loading...</p>;
    }

    if (!this.data.activeGame) {
      return (
        <div className="container">
          <header>
            <h1>Todo List</h1>
          </header>

          <button type="button" onClick={this.handleClickNewGame}>New game</button>
        </div>
      );
    }

    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>
        </header>

        <button type="button" onClick={this.handleClickNewGame}>New game</button>
        <Board data={this.data.activeGame.board} />
 
      </div>
    );
  }
});
