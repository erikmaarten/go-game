OwnerChooseRole = React.createClass({
  clickBlack(event) {
    Meteor.call("setOwnerRole", "black_player", function(error, result) {
      if (error) {console.log("error calling setOwnerRole: " + error);}
    });
  },

  clickWhite(event) {
    Meteor.call("setOwnerRole", "white_player", function(error, result) {
      if (error) {console.log("error calling setOwnerRole: " + error);}
    });
  },

  clickViewer(event) {
    Meteor.call("setOwnerRole", "viewer", function(error, result) {
      if (error) {console.log("error calling setOwnerRole: " + error);}
    });
  },

  render() {
    return (
      <div id="owner-choose-role">
        <button type="button" onClick={this.clickBlack} >Play as black</button>
        <button type="button" onClick={this.clickWhite} >Play as white</button>
        <button type="button" onClick={this.clickViewer} >View</button>
      </div>
    );
  }
});