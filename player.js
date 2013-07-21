bds.makePlayer = function(options) {
  var self = {}, options = options || {};

  var name = options.name,
      points = options.points;

  self.name = name;
  self.points = points;

  return self;
}
