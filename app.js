bds.makeApp = function(svg, json, options) {
  var self = {},

    // create players
    players = {
        1 : bds.makePlayer({ name: 'Henry' })
    }
    ;
      
  // playable status flag
  var playable = false;

  var setPlayable = function(v) {
    playable = v;
  };

  var canPlay = function() {
    return playable;
  };

  var _currentPlayer;
  var currentPlayer = function(id) {
    if ( ! id ) return _currentPlayer;
    _currentPlayer = players[id];
    return _currentPlayer;
  };

  // event handlers

  var onStart = function() {
    if ( self.started ) return;
    self.started = true;
    setPlayable(true); 
    bds.circleTracker.first();
    bds.start.off(); 
    $.publish('bdsPlay', [null, 3000]);
  };

  var onGo = function() {
    // guards
    if (! self.started) return;
    if (! self.moveable) return;

    // set settings
    self.moveable = false;
    setPlayable(true);

    // get a list of potential next moves
    var potents = bds.circleTracker.getPotentials(bds.dice.currentFace);

    // if only one option, play it
    if ( potents.length === 1 ) {
      bds.circleTracker.leaveAndLand(bds.dice.currentFace);
      $.publish('bdsPlay', [null, 3000]);
    }
    // else let the user decide
    else {
      $.each(potents, function() { this.potentialize(); });
    }
    
    // controls
    bds.go.off();
    bds.dice.off();
  };

  var onStageComplete = function(e) {
    self.rollable = true;
    setPlayable(false);
    bds.circleTracker.completeStage(function() {
      bds.roller.on(); 
    });
  };

  var onRolling = function() {
    if (! self.rollable ) return;
    bds.dice.roll();
    self.rollable = false
    self.moveable = true;
  };

  var onRolled = function() {
    self.rollable = false;
    setTimeout(bds.roller.off, bds.shortDelay);
  };

  var onPlay = function(e, id, delay) {
    if (! canPlay() ) return;

    if ( id ) {
      if (! bds.circleTracker.isCurrent(id) )  
        return;
    }

    var delay = delay || 0;
    setTimeout(function() {
      bds.circleTracker.current.play();
    }, delay);
  };

  var onScoreChange = function() {
    //bds.score.update();      
  };

  var onShowPotentials = function() {
    var potents = bds.circleTracker.getPotentials(bds.dice.currentFace);
  };

  // change params to option hash
  var hydrate = function(id, passed) {
    self.started = true;
    completed = bds.db.get( 'completed' );
    bds.circleTracker.current = bds.circleTracker.get(id);

    $.each(completed, function(k, v) {
      bds.circleTracker.get(v).complete();  
    });

    bds.circleTracker.current.pop(function() {
      if (passed) {
        $.publish('bdsStageComplete');
      }
    });

    bds.start.off();
  };

  // create ui elements

  bds.controls  =  bds.makeActions( $(options.content) );
  bds.page      =  bds.makePage( $(options.content), options.svgContainer );
  bds.banner    =  bds.makeBanner( $(options.content) );
  bds.board     =  bds.makeBoard(svg, json, options);

  // wire events

  $.subscribe('bdsStart', onStart);
  $.subscribe('bdsGo', onGo);
  $.subscribe('bdsStageComplete', onStageComplete);
  $.subscribe('bdsRolled', onRolled);
  $.subscribe('bdsRolling', onRolling);
  $.subscribe('bdsPlay', onPlay);
  $.subscribe('bdsScoreChange', onScoreChange);
  $.subscribe('bdsShowPotentials', onShowPotentials);

  // clear local storage

  bds.db
      .wipe()
      .save('completed', []);

  // initialize global game variables

  self.started = false;
  self.moveable = false;
  self.rollable = false;
  _currentPlayer = players[1];

  // api
  bds.players = players;
  bds.currentPlayer = currentPlayer;
  
  return self;
};
