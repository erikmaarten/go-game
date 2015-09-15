GameActions = React.createClass({
  propTypes: {
    currentPlayer: React.PropTypes.string.isRequired
  },

  handlePass(event) {
    event.preventDefault();
    Meteor.call("pass", function(error, result) {
      if (error) {console.log("error calling pass: " + error);}
    });
  },

  render() {
    var isCurrentPlayer = this.props.currentPlayer === Meteor.userId();
    return (
      <button type="button" onClick={this.handlePass} disabled={isCurrentPlayer ? false : true} >
        Pass
      </button>
    )
  }
});