bds.makeCircle = function(elem, label) {
  var self = {}, 
      $elem = $(elem),
      d3o = d3.select(elem),
      startingRadius = d3o.attr('r'),
      isBig = false,
      label = d3.select(label),
      displayName = label.text()
      ;

  var pop = function(callback, hideLabel) {
    var callback = callback || bds.noop;

    d3o.transition()
       .duration(1000)
       .attr('r', startingRadius * 4)
       .each('end', function() {
         callback();
         if ( hideLabel ) return;
         label
            .attr('font-size', 20)
            .style('fill', 'black');
       });

    isBig = true;
    return self;
  };

  var drop = function() {
    var options = options || {};

    d3o.transition()
       .duration(500)
       .attr('r', startingRadius);

    isBig = false;

    label.transition()
         .attr('font-size', 10)
         .attr('dx', function(d){return d.x - 10;})
         .attr('dy', function(d){return d.y + 5; })
         ;

    return self;
  };

  var hop = function() {
      pop(drop, true);
  };

  var isStart = function() {
    return $elem.data('start');
  };

  var next = function() {
    return $elem.data('next');
  };

  // TODO: should this raise an event that the page object can respond to?
  // rather than having the circle fading the board?
  var play = function() {
      // TODO: get these elements from the app (e.g. $thediv)
      bds.page.board.fadeOut(1200, function() {
        // TODO: get the url fragment from bds.config
        var url = '/stages/' + self.id;
        bds.page.stage.load(url, function() {
          $(this).fadeIn(1200);
        });
      });
  };

  var potentialize = function() {
   pop();
   $elem.on('click', function() {
      // TODO: should id be private, getter/setter?
      // TODO: also should we be able to set circleTracker.current like this? getter/setter?
      $.publish('bdsDepotentialize', [ self.id ]);
      bds.circleTracker.current = self; 
      $.publish('bdsPlay', [null, 3000]);
   });
  };

  var depotentialize = function() {
    drop();
    $elem.off();
  };

  var onDepotentialize = function(e, callerId) {
    if ( self.id == callerId ) return;
    depotentialize();
  };

  var complete = function(callback) {
    var callback = callback || bds.noop;

    d3o.transition()
        .duration(2500)
        .style('fill', 'silver')
        .style('stroke', 'black')
        .each('end', function() {
          callback();
          label.style('fill', 'black');

          label.text(shortLabel())
               .attr('dx', function(d) { return d.x - 10; })
               .attr('dy', function(d) { return d.y + 5; });

          drop();
        });

  };

  var shortLabel = function() {
    return displayName.split(' ').reduce(function(a, b) {
      return a.split('')[0] + b.split('')[0];
    });
  };

  var wire = function() {
    $.subscribe('bdsDepotentialize', onDepotentialize);
  };

  self.pop = pop;
  self.drop = drop;
  self.hop = hop;
  self.sticky = false;
  self.isStart = isStart;
  self.next = next;
  self.play = play;
  self.potentialize = potentialize;
  self.complete = complete;
  self.id = $elem.attr('id'); 
  self.name = $elem.data('name');
  self.displayName = displayName;

  // init
  wire();
  bds.circleTracker.add(self.id, self); 

  return self;
}
