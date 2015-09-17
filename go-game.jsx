if (Meteor.isClient) {
  // This code is executed on the client only
  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    React.render(<App />, document.getElementById("render-target"));

    Meteor.setTimeout(function() {
      GridCanvas.positionAndRender();
    }, 1000);

    $(window).bind('resize', function() {
      GridCanvas.delayedRender();
    });

  });
}

