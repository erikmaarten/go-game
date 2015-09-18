GameInfo = React.createClass({
  mixins: [ReactMeteorData],

  propTypes: {
    players: React.PropTypes.array.isRequired,
    currentPlayer: React.PropTypes.string.isRequired
  },

  getMeteorData() {
    var handle = Meteor.subscribe("allUsers");
    var otherPlayerId = _.chain(this.props.players)
      .filter(function(player) {
        return player.userId !== Meteor.userId();
      })
      .map(function(player) {
        return player.userId;
      })
      .value()[0];
    return {
      loading: ! handle.ready(),
      me: Meteor.user(),
      you: Meteor.users.findOne({_id: otherPlayerId})
    };
  },

  userIdToName(userId) {
    return "snth";
    var user = Meteor.users.findOne({_id: userId});
    return user.emails[0];
  },

  render() {
    var isYou = this.props.currentPlayer === Meteor.userId();
    var myColor = _.chain(this.props.players)
      .filter(function(player) { return player.userId === Meteor.userId();})
      .map(function(player) { return player.color;})
      .value()[0];
    var yourColor = _.chain(this.props.players)
      .filter(function(player) { return player.userId !== Meteor.userId();})
      .map(function(player) { return player.color;})
      .value()[0];

    if (this.data.loading) {
      return (<p>loading...</p>);
    } else {
      return (
        <div>
          <div id="game-info">
            <table>
              <tr>
                <td className={isYou ? "" : "invisible"}>
                  <i className="fa fa-hand-o-right"></i>
                </td>
                <td><span className={"turn-indicator-" + myColor}></span></td>
                <td>{this.data.me.emails[0].address}</td>
              </tr>
              <tr>
                <td className={isYou ? "invisible" : ""}>
                  <i className="fa fa-hand-o-right"></i>
                </td>
                <td><span className={"turn-indicator-" + yourColor}></span></td>
                <td>{this.data.you.emails[0].address}</td>
              </tr>
            </table>
          </div>
        </div>
      )
    }
  }
});