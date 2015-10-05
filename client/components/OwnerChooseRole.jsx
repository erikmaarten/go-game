/*global OwnerChooseRole:true */
OwnerChooseRole = React.createClass({
  clickBlack() {
    Meteor.call("setOwnerRole", "black_player", function(error) {
      if (error) {console.log("error calling setOwnerRole: " + error);}
    });
  },

  clickWhite() {
    Meteor.call("setOwnerRole", "white_player", function(error) {
      if (error) {console.log("error calling setOwnerRole: " + error);}
    });
  },

  clickViewer() {
    Meteor.call("setOwnerRole", "viewer", function(error) {
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
