GameInfo = React.createClass({
  propTypes: {
    players: React.PropTypes.array.isRequired
  },

  playerOfColor(color) {
    return _.chain(this.props.players)
      .filter(function(player) {
        player.color === color;
      })
      .value()[0];
  },

  test() {
    console.log("test");
    /*
        <p>Black: {this.playerOfColor("black").userId}</p>
        <p>White: {this.playerOfColor("white").userId}</p>
        */
  },

  pColor(players, color) {

  },

  render() {
    return (
      <div>
      <p>{this.test()}</p>
      <p>Black: {this.playerOfColor("black")}</p>
      {/*<p>{this.playerOfColor()}</p>*/}

      </div>
    )
  }
});