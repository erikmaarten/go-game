// Task component - represents a single todo item
Intersection = React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired,
    position: React.PropTypes.array.isRequired
  },

  handleClick() {
    var pos = this.props.position;
    console.log(pos);
    Game.update(pos, "black");
  },

  render() {
    if (this.props.type == 1) {
      // is black stone
      return (
        <span className="intersection intersection-filled">
          <Stone color="black" />
        </span>
      );
    } else if (this.props.type == -1) {
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
