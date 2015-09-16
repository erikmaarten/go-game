// Task component - represents a single todo item
Intersection = React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired,
    position: React.PropTypes.array.isRequired,
    players: React.PropTypes.array.isRequired
  },

  handleClick() {
    if (this.props.type === NO_STONE) {
      var pos = this.props.position;
      var color = _.chain(this.props.players)
        .filter(function(player) {
          return player.userId === Meteor.userId();
        })
        .map(function(player) {
          return player.color;
        })
        .value()[0];
      Game.placeStone(pos);
    }
  },

  render() {
    var classes = "intersection";
    if (this.props.type === NO_STONE) {
      classes += " intersection-empty";
    }

    var stoneClass = "";
    if (this.props.type === BLACK_STONE) {
      stoneClass = "stone-black";
    } else if (this.props.type === WHITE_STONE) {
      stoneClass = "stone-white";
    } else if (this.props.type === NO_STONE) {
      stoneClass = "no-stone";
    }

    var positionKey = this.props.position[0] + ", " + this.props.position[1];
    return (
      <span className={classes} key={positionKey} onClick={this.handleClick} >
        <span className={stoneClass} >
          {stoneClass === "no-stone" ? "+" : ""}
        </span>
      </span>
    );
  }
});
