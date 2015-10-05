/*globals GameActions:true, window */
GameActions = React.createClass({
  propTypes: {
    currentPlayer: React.PropTypes.string.isRequired,
    playerColor: React.PropTypes.string.isRequired
  },

  handlePass(event) {
    event.preventDefault();
    Meteor.call("pass", function(error) {
      if (error) {console.log("error calling pass: " + error);}
    });
  },

  handleResign(event) {
    event.preventDefault();
    if (window.confirm("Do you really want to resign?")) {
      Meteor.call("resign", function(error) {
        if (error) {console.log("error calling method resign: " + error);}
      });
    }
  },

  render() {
    var isCurrentPlayer = this.props.currentPlayer === this.props.playerColor;
    return (
      <div id="game-actions">
        <button type="button" onClick={this.handlePass} disabled={isCurrentPlayer ? false : true} >
          Pass
        </button>
        <button type="button" onClick={this.handleResign}
          disabled={isCurrentPlayer ? false : true} >
          Resign
        </button>
      </div>
    );
  }
});
