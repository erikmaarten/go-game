if (Meteor.isClient) {
  // This code is executed on the client only
  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    React.render(<LeftSidebar />, document.getElementById("left-sidebar-render-target"));
    React.render(<App />, document.getElementById("render-target"));

    $(window).bind('resize', function() {
      GridCanvas.delayedRender();
    });

  });
}

