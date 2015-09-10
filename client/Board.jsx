Board = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    data: React.PropTypes.string.isRequired
  },

  split(a, n) {
    var len = a.length,out = [], i = 0;
    while (i < len) {
        var size = Math.ceil((len - i) / n--);
        out.push(a.slice(i, i += size));
    }
    return out;
  },

  handleBoardClick(event) {
    console.log(event.target);
    console.log(event.currentTarget);
  },

  render() {
    var board_rows = this.split(this.props.data, 19);
    var rows = board_rows.map((row, index) => {
      return <BoardRow data={row} rowIndex={index}/>;
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
    rowIndex: React.PropTypes.number.isRequired
  },

  render() {
    var raw_intersections = this.props.data.split("");
    var intersections = raw_intersections.map((type, index) => {
      return <Intersection type={type} position={[this.props.rowIndex, index]} />;
    });
    return (
      <div className="board-row">{intersections}</div>
    );
  }
});