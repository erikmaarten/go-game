GameInfo = React.createClass({
  propTypes: {
    players: React.PropTypes.array.isRequired
  },

  render() {
    return (
      <div>
        <p>Black: {this.props.players[0].userId}</p>
        <p>White: {this.props.players[1].userId}</p>
      </div>
    )
  }
});