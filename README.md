![Picture of Go / Weiqi](https://raw.githubusercontent.com/erikmaarten/go-game/master/.sandstorm/app-graphics/screen_707x522.png "A game of Go / Weiqi")

# Go/Weiqi
Go/Weiqi is a board game originating from ancient China. It is played by two players
taking turns to place white and black stones on the intersections of the board. The goal of the game is to surround more territory than the other player.

## Install/Play
This app designed to be run on [Sandstorm](https://sandstorm.io) and is available on [Sandstorm](https://apps.sandstorm.io/app/r75g5cp60zsc3u80zt278kek9v84k786c0tf7mm30hwhvu2njrg0). Click "demo" to try it out.

## Rules
There are many variations of rules for this game, but this implementation uses Chinese-derived rules. The main points are outlined below and [further details can be found here (Wikipedia)](https://en.wikipedia.org/wiki/Rules_of_go). 

### Scoring
Area scoring. Points are awarded for territories belonging to a player, and for the intersections that the player's stones occupy.
Other rules:
* [Suicide is forbidden](https://en.wikipedia.org/wiki/Rules_of_go#Suicide)
* No komi
* [Positional super kō](https://en.wikipedia.org/wiki/Rules_of_go#Repetition): a move that would result in a board position that has previously occurred is illegal

### End of game
The game ends when the two players pass consecutively.