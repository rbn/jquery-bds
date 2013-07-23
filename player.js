bds.makePlayer = function(options) {
  var self = {}, options = options || {},
      arrCompletedStages = [],
      name = options.name,
      points = options.points || 0;


  var completeStage = function(id) {
    arrCompletedStages.push(id);
    points += 50;
  };

  var completedStages = function() {
    return arrCompletedStages;
  };

  var getPoints = function() {
    return points;
  };

  self.name = name;
  self.getPoints = getPoints;
  self.completeStage = completeStage;
  self.completedStages = completedStages;

  return self;
}
