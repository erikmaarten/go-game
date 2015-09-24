// Task component - represents a single todo item
Intersection = React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired,
    position: React.PropTypes.array.isRequired,
    playerColor: React.PropTypes.string.isRequired,
    currentPlayer: React.PropTypes.string.isRequired,
    gameStatus: React.PropTypes.string.isRequired
  },

  handleClick() {
    if (this.props.gameStatus === "ended") {
      Flash.info("The game has already ended. Press 'New game' to play again");
    } else if (this.props.type === NO_STONE) {
      var pos = this.props.position;

      // Attempt placing the stone on the empty intersection clicked
      // There are a few cases in which it is illegal to place a stone
      // on a particular intersection, these cases are checked for here
      Meteor.call("placeStone", pos, function(error, resultCode) {
        if (error) {
          console.log("error calling placeStone: " + error);
        } else if (resultCode === STATUS.suicide_illegal) {
          Flash.error("Suicide: You cannot make a move that results in your own stones being captured");
        } else if (resultCode === STATUS.superko_violation) {
          Flash.error("That move would violate the super kō rule");
        } else if (resultCode === STATUS.not_your_turn) {
          Flash.warning("It's not your turn yet.");
        } else {
          //console.log("resultCode: " + resultCode);
        }
      });
    } else {
      // It's your turn, but the intersection is already occupied
      Flash.error("That intersection is already taken. Try another one!");
    }
  },

  mouseOver(event) {
    if (this.props.type !== NO_STONE) {
      return;
    } else {
      var hoverClass = "hover-empty-" + this.props.playerColor;
      $(event.currentTarget).addClass(hoverClass);
    }
  },

  mouseOut(event) {
    if (this.props.type !== NO_STONE) {
      return;
    } else {
      var hoverClass = "hover-empty-" + this.props.playerColor;
      $(event.currentTarget).removeClass(hoverClass);
    }
  },

  render() {
    var classes = "intersection";
    if (this.props.type === NO_STONE) {
      classes += " intersection-empty";
    }

    var stoneClass = "";
    if (this.props.type === BLACK_STONE) {
      stoneClass = "stone-black";
    } else if (this.props.type === WHITE_STONE) {
      stoneClass = "stone-white";
    } else if (this.props.type === NO_STONE) {
      stoneClass = "no-stone";
    }

    var isPlayer = this.props.playerColor === "white" || 
      this.props.playerColor === "black";
    var positionKey = this.props.position[0] + ", " + this.props.position[1];
    return (
      <span className={classes} key={positionKey} 
        onClick={isPlayer ? this.handleClick : ""} >
        <span className={stoneClass} onMouseOver={this.mouseOver} onMouseOut={this.mouseOut} >
        </span>
      </span>
    );
  }
});
