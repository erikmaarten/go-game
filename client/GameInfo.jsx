GameInfo = React.createClass({
  propTypes: {
    players: React.PropTypes.array.isRequired
  },

  render() {
    return (
      <div>
      <p>{this.test()}</p>
      <p>Black: {this.props.players[0].userId}</p>
      <p>White: {this.props.players[1].userId}</p>
      {/*<p>{this.playerOfColor()}</p>*/}

      </div>
    )
  }
});