/*global LeftSidebar:true */
LeftSidebar = React.createClass({

  render() {
    return (
      <div>
        <h1>Go</h1>
        <p><i>Go is a board game originating from ancient China. It is played by two players
        taking turns to place white and black stones on the intersections of the board. The
        goal of the game is to surround more territory than the other player.
        </i></p>
        <h2>Rules</h2>
        <p>A player's score is the sum of the number of stones of that player's color
          and the number of intersections in empty groups that the player has surrounded.
          An empty group is a number of unoccupied intersections that are linked to each other
          through other unoccupied, adjacent intersections.</p>
        <ul>
          <li>Two consecutive passes end the game</li>
          <li><a target="_blank" href="https://en.wikipedia.org/wiki/Rules_of_go#Repetition">Positional super kō
            </a>: a move that would result in a board position
            that has previously occurred is illegal</li>
          <li>No komi</li>
          <li><a target="_blank" href="https://en.wikipedia.org/wiki/Rules_of_go#Suicide">
            Suicide</a> not allowed</li>
        </ul>
        <a target="_blank" href="https://en.wikipedia.org/wiki/Rules_of_go">Detailed rules (Wikipedia)</a>
      </div>
      );
  }

});
