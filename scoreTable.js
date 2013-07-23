bds.makeScoreTable = function( selector ) {
  var self = {},
      $elem = $(selector);

  var draw = function() {

    $elem

      // fade it out
      .fadeOut('slow', function() {
        
        // clear it
        $elem.html('');

        // write to it
        $.each(bds.players, function(key, value) {
          $elem.append('<p>' + this.name + ' : ' + this.getPoints() + '</p>');
     
          $elem.append('<hr />');
          $elem.append('<h6>Completed Stages:</h6>');
          $.each(this.completedStages(), function() {
            $elem.append('<p>' + bds.circleTracker.get(this).displayName + '</p>');
          });
        })
      })

        // fade it back in
        .fadeIn('slow');
  };

  // api
  self.draw = draw;

  return self;
};
