bds.makeApp = function(svg, json, options) {
  var self = {};
      
  // playable status flag
  var playable = false;

  var setPlayable = function(v) {
    playable = v;
  };

  var canPlay = function() {
    return playable;
  };

  // event handlers

  var onStart = function() {
    if ( self.started ) return;
    self.started = true;
    setPlayable(true); 
    bds.circles.first();
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
    var potents = bds.circles.getPotentials(bds.dice.currentFace);

    // if only one option, play it
    if ( potents.length === 1 ) {
      bds.circles.leaveAndLand(bds.dice.currentFace);
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
    bds.circles.completeStage(function() {
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
    bds.roller.off();
    bds.go.on();
  };

  var onPlay = function(e, id, delay) {
    if (! canPlay() ) return;

    if ( id ) {
      if (! bds.circles.isCurrent(id) )  
        return;
    }

    var delay = delay || 0;
    setTimeout(function() {
      bds.circles.current.play();
    }, delay);
  };

  var onScoreChange = function() {
    bds.score.update();      
  };

  var onShowPotentials = function() {
    alert('test');
    var potents = bds.circles.getPotentials(bds.dice.currentFace);
    alert(potents.length);
  };

  // change params to option hash
  var hydrate = function(id, passed) {
    self.started = true;
    completed = bds.db.get( 'completed' );
    bds.circles.current = bds.circles.get(id);

    $.each(completed, function(k, v) {
      bds.circles.get(v).complete(null, true);  
    });

    bds.circles.current.pop(function() {
      if (passed) {
        $.publish('bdsStageComplete');
      }
    });

    bds.start.off();
  };

  // create ui elements

  bds.controls = bds.makeActions( $(options.content) );
  bds.page = bds.makePage( $(options.content), options.svgContainer );
  bds.banner = bds.makeBanner( $(options.content) );
  bds.makeBoard(svg, json, options);

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

  bds.db.wipe()
        .save('completed', []);


  // initialize global game variables

  self.started = false;
  self.moveable = false;
  self.rollable = false;
  
  return self;
};
