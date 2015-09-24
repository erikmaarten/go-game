Board = React.createClass({
  propTypes: {
    data: React.PropTypes.string.isRequired,
    currentPlayer: React.PropTypes.string.isRequired,
    playerColor: React.PropTypes.string.isRequired,
    gameStatus: React.PropTypes.string.isRequired
  },

  // Split a in n equal parts
  split(a, n) {
    var len = a.length,out = [], i = 0;
    while (i < len) {
        var size = Math.ceil((len - i) / n--);
        out.push(a.slice(i, i += size));
    }
    return out;
  },

  render() {
    var board_rows = this.split(this.props.data, Game.getBoardWidth(this.props.data));
    var rows = board_rows.map((row, rowIndex) => {
      // For each row, split the row's intersection values into
      // separate entries in an array
      // Then map each of those intersections to an Intersection element
      var raw_intersections = row.split("");
      var outputRow = raw_intersections.map((type, colIndex) => {
        return <Intersection playerColor={this.props.playerColor} 
          type={type} key={rowIndex + " " + colIndex} 
          position={[rowIndex, colIndex]} gameStatus={this.props.gameStatus} 
          currentPlayer={this.props.currentPlayer} />;
      });
      return <div className="board-row" key={rowIndex} >{outputRow}</div>;
    });

    return (
      <div className="board" >{rows}</div>
    );
  }
});