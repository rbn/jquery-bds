bds.keeper = (function() {
  var self = {}
      SCORE = 'score'
      ;

  var add = function (n) {
    var current_score = bds.db.get( SCORE ) || 0;
    bds.db.save( SCORE , current_score + n); 
    $.publish('bds_score_change');
  };

  var score = function() {
    bds.db.get( SCORE );
  };

  self.add = add;

  return self;
})();
