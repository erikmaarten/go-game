GridCanvas = {};
var renderTimeout;
GridCanvas.delayedRender = function() {
  Meteor.clearTimeout(renderTimeout);
  renderTimeout = Meteor.setTimeout(function() {
    GridCanvas.positionAndRender();
  }, 400);
}

GridCanvas.positionAndRender = function() {
  // Don't do anything if there is no board
  // on the page
  var boardExists = $('.intersection').length !== 0;
  if (!boardExists) {
    return false;
  }
  var firstBoardElement = $('.intersection')[0].getBoundingClientRect();
  var top = firstBoardElement.top;
  var width = firstBoardElement.width;
  var left = firstBoardElement.left;
  var canvas = document.getElementById("grid-canvas");
  var board = Session.get("board");
  var unitsWide = Game.getBoardWidth(board);

  canvas.style.top = top + "px";
  canvas.style.left = left + "px";
  GridCanvas.renderGrid("grid-canvas", unitsWide, unitsWide*width, width);
}

GridCanvas.renderGrid = function(canvasId, boardWidthUnits, boardWidthPx, unitWidthPx) {
  // also set up window resize event listener here?
  check(canvasId, String);
  check(boardWidthUnits, Number);
  check(boardWidthPx, Number);
  check(unitWidthPx, Number);

  var canvas = document.getElementById(canvasId);
  var context = canvas.getContext('2d');
  this.setCanvasSize(canvas, boardWidthPx);
  this.draw(context, boardWidthUnits, boardWidthPx, unitWidthPx);
}

GridCanvas.setCanvasSize = function(canvasEl, boardWidthInPixels) {
  canvasEl.width = boardWidthInPixels;
  canvasEl.height = boardWidthInPixels;
}

GridCanvas.draw = function(canvasContext, boardWidthUnits, boardWidthPx, unitWidthPx) {
  // Begin drawing lines from middle of board squares, since intersections on the board
  // will be represented by lines crossing each other

  var halfUnitPx = unitWidthPx / 2;

  // draw vertical lines
  for (var x = 0; x < boardWidthUnits; ++x) {
    var start_x = x*unitWidthPx + halfUnitPx;
    var start_y = 0 + halfUnitPx;
    var end_x = start_x;
    var end_y = start_y + (boardWidthUnits - 1) * unitWidthPx;
    canvasContext.moveTo(start_x, start_y);
    canvasContext.lineTo(end_x, end_y);
  }

  // draw horizontal lines
  for (var y = 0; y < boardWidthUnits; ++y) {
    var start_x = 0 + halfUnitPx;
    var start_y = y*unitWidthPx + halfUnitPx;
    var end_x = start_x + (boardWidthUnits - 1) * unitWidthPx;
    var end_y = start_y;
    canvasContext.moveTo(start_x, start_y);
    canvasContext.lineTo(end_x, end_y);
  }
  canvasContext.fillStyle = "#dcb35c";
  canvasContext.fillRect(0, 0, boardWidthPx, boardWidthPx);

  canvasContext.strokeStyle = "#000";
  canvasContext.stroke();
}