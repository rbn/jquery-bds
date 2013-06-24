bds.keeper = (function() {
  var self = {}
      SCORE = 'score'
      ;

  var add = function (n) {
    var currentScore = bds.db.get( SCORE ) || 0;
    bds.db.save( SCORE , currentScore + n); 
    $.publish('bdsScoreChange');
  };

  var score = function() {
    bds.db.get( SCORE );
  };

  self.add = add;

  return self;
})();
