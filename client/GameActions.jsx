GameActions = React.createClass({
  handlePass(event) {
    event.preventDefault();
    Meteor.call("pass", function(error, result) {
      if (error) {console.log("error calling pass: " + error);}
    });
  },

  render() {
    return (
      <button type="button" onClick={this.handlePass}>Pass</button>
    )
  }
});