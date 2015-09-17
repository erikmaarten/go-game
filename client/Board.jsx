Board = React.createClass({
  propTypes: {
    // We can use propTypes to indicate it is required
    data: React.PropTypes.string.isRequired,
    playerColor: React.PropTypes.string.isRequired,
    players: React.PropTypes.array.isRequired,
    currentPlayer: React.PropTypes.string.isRequired
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

  handleBoardClick(event) {
    //console.log(event.target);
    //console.log(event.currentTarget);
  },

  render() {
    var board_rows = this.split(this.props.data, Game.getBoardWidth(this.props.data));
    var rows = board_rows.map((row, index) => {
      return <BoardRow data={row} rowIndex={index} key={index} 
        playerColor={this.props.playerColor} players={this.props.players} 
        currentPlayer={this.props.currentPlayer} />;
    });
    /*
    var rows = _.each(board_rows, function(element, index) {
      return 
    })*/
    return (
      <div className="board" onClick={this.handleBoardClick} >{rows}</div>
    );
  }
});

BoardRow = React.createClass({
  propTypes: {
    data: React.PropTypes.string.isRequired,
    rowIndex: React.PropTypes.number.isRequired,
    players: React.PropTypes.array.isRequired,
    playerColor: React.PropTypes.string.isRequired,
    currentPlayer: React.PropTypes.string.isRequired
  },

  render() {
    var raw_intersections = this.props.data.split("");
    var intersections = raw_intersections.map((type, index) => {
      return <Intersection playerColor={this.props.playerColor} 
        players={this.props.players} type={type} key={this.props.rowIndex + " " + index} 
        position={[this.props.rowIndex, index]} currentPlayer={this.props.currentPlayer} />;
    });
    return (
      <div className="board-row">{intersections}</div>
    );
  }
});