// Task component - represents a single todo item
Stone = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    color: React.PropTypes.string.isRequired
  },
  render() {
    if (this.props.color === "black") {
      return <span className="stone-black"></span>;
    } else if (this.props.color === "white") {
      return <span className="stone-white"></span>;
    }
  }
});
