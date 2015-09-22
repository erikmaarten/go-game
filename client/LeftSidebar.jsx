LeftSidebar = React.createClass({

  render() {
    return (
      <div>
        <h1>Go</h1>
        <p><i>Go is an old board game originating from ancient China. It is played by two players
        taking turns to place white and black stones on the intersections of the board. The 
        goal of the game is to surround more territory than the other player.
        </i></p>
        <h2>Rules</h2>
        <p>A player's score is the sum of the number of stones of that player's color
          and the number of intersections in empty groups that the player has surrounded.
          An empty group is a number of unoccupied intersections that are linked to each other
          through other unoccupied, adjacent intersections.</p>
        <p>No handicap (komi) can be given.</p>
        <a href="https://en.wikipedia.org/wiki/Rules_of_go">Detailed rules (Wikipedia)</a>
      </div>
      );
  }

});