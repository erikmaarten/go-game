// Task component - represents a single todo item
Intersection = React.createClass({
  propTypes: {
    board: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    position: React.PropTypes.array.isRequired,
    players: React.PropTypes.array.isRequired
  },

  handleClick() {
    var pos = this.props.position;
    console.log(pos);
    var color = _.chain(this.props.players)
      .filter(function(player) {
        return player.userId === Meteor.userId();
      })
      .map(function(player) {
        return player.color;
      })
      .value()[0];

    var numLiberties = Game.numberOfLiberties(this.props.board, pos, color);
    console.log("numLiberties: " + numLiberties);
    Game.update(pos);
  },

  render() {
    if (this.props.type == 1) {
      // is black stone
      return (
        <span className="intersection intersection-filled">
          <Stone color="black" />
        </span>
      );
    } else if (this.props.type == 2) {
      // is white stone
      return (
        <span className="intersection intersection-filled">
          <Stone color="white" />
        </span>
      );
    } else {
      // Is empty intersection
      return (
        <span className="intersection intersection-empty" onClick={this.handleClick}>+</span>
      );
    }
  }
});
