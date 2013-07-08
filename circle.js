// track circles out in the field
bds.circles = (function() {
  var self = {},
      names = {};

  var add = function(id, circle) {
    self[id] = circle;
    names[circle.name] = circle;
    if ( circle.isStart() ) {
      self.start = circle;
      self.current = self.start;
     }
  };

  var get = function(id) {
    return self[id];
  };

  var getByName = function(name) {
    return names[name]; 
  };

  var first = function() {
    land(); 
  };

  var leave = function() {
    self.current.drop();
  };

  var isCurrent = function(id) {
    return self.current.id == id;
  };

  var land = function(n) {
    // handle start
    if (! n) {
      self.start.pop();
      return;
    }

    for(i = 0; i < n; i ++) {
      var isDest = ( i == n - 1 );

      // TODO: for now only looking at first "next" - enhance
      // to handle all possible "nexts"

      var nextName = self.current.next()[0]; 
      self.current = getByName(nextName);
      if (! isDest ) {
        setTimeout(self.current.hop, i*250);
      }
    }

    setTimeout(self.current.pop, n*250);
  };

  // get list of potential next moves
  // n: number of moves
  // circle: starting circle
  // potentials: optional parameter - array that tracks found potentials
  var getPotentials = function(n, circle, potentials) {
    if ( n === undefined ) return []
    var circle = circle || self.current,
        potentials = potentials || [];

    // check for recursive end
    if (! n ) {
      potentials.push(circle); 
      return false;
    }

    // recurse
    var nexts = circle.next();
    $.each(nexts, function() {
      getPotentials( n - 1, getByName(this), potentials );
    });

    return potentials;
  };
  
  var leaveAndLand = function(n) {
    leave();
    land(n);
  };

  var completeStage = function(callback) {
    self.current.complete(callback);
    bds.keeper.add(10);
    track(self.current.id);
  };

  var track = function(id) {
    var arr = bds.db.get('completed');
    var serializedId = bds.db.get(id);

    if (! ($.inArray(serializedId, arr)  > -1 ) )
      arr.push(id);

    bds.db.save('completed', arr);
  };

  self.add = add;
  self.get = get;

  // TODO: this method looks like something other than it is - fix!
  self.first = first;
  self.isCurrent = isCurrent;
  self.leaveAndLand = leaveAndLand;
  self.completeStage = completeStage;
  self.getPotentials = getPotentials;

  return self;
})();

// circle constructor
bds.makeCircle = function(elem, label) {
  var self = {}, 
      $elem = $(elem),
      d3o = d3.select(elem),
      startingRadius = d3o.attr('r'),
      isBig = false,
      label = d3.select(label)
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
    d3o.transition()
       .duration(500)
       .attr('r', startingRadius);
    isBig = false;

    label.transition()
          .attr('font-size', 10)
          .attr('dx', function(d){return d.x - 10;})
          .attr('dy', function(d){return d.y + 5; })
          .text('MC');
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
      bds.page.$board.fadeOut(1200, function() {
        // TODO: get the url fragment from bds.config
        var url = '/stages/' + self.id;
        bds.page.$stage.load(url, function() {
          $(this).fadeIn(1200);
        });
      });
  };

  var potentialize = function() {
   pop();
   $elem.on('click', function() {
      // TODO: should id be private, getter/setter?
      // TODO: also should we be able to set circles.current like this? getter/setter?
      $.publish('bdsDepotentialize', [ self.id ]);
      bds.circles.current = self; 
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

  var complete = function(callback, shortLabel) {
    var callback = callback || bds.noop;

    d3o.transition()
        .duration(2500)
        .style('fill', 'silver')
        .style('stroke', 'black')
        .each('end', function() {
          callback();
          label.style('fill', 'black');

          if (shortLabel)
            label.text('MC')
                 .attr('dx', function(d) { return d.x - 10; })
                 .attr('dy', function(d) { return d.y + 5; });
          else
            label.text('Marketing Call');
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

  // init
  wire();
  bds.circles.add(self.id, self); 

  return self;
}
