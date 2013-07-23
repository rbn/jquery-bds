// track circles out in the field
bds.circleTracker = (function() {
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
    // self.current.drop();
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
