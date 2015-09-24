GameInfo = React.createClass({
  propTypes: {
    currentPlayer: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <div>
        <div id="game-info">
          <table>
            <tr>
              <td className={this.props.currentPlayer === "white" ? "invisible" : ""}>
                <i className="fa fa-hand-o-right"></i>
              </td>
              <td><span className="turn-indicator-black"></span></td>
            </tr>
            <tr>
              <td className={this.props.currentPlayer === "black" ? "invisible" : ""}>
                <i className="fa fa-hand-o-right"></i>
              </td>
              <td><span className="turn-indicator-white"></span></td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
});