bds.make_app = function(svg, json, options) {
  var self = {};
      
  // flags and accessors used to determine 
  // if board is in a playable state

  var playable = false
      ;

  var set_playable = function(v) {
    playable = v;
  };

  var can_play = function() {
    return playable;
  };

  // event handlers

  var on_start = function() {
    if ( self.started ) return;
    self.started = true;
    set_playable(true); 
    bds.circles.first();
    bds.start.off(); 
    $.publish('bds_play', [null, 3000]);
  };

  var on_go = function() {
    // guards
    if (! self.started) return;
    if (! self.moveable) return;

    // set settings
    self.moveable = false;
    set_playable(true);

    // get a list of potential next moves
    var potents = bds.circles.get_potentials(bds.dice.current_face);

    // if only one option, play it
    if ( potents.length === 1 ) {
      bds.circles.leave_and_land(bds.dice.current_face);
      $.publish('bds_play', [null, 3000]);
    }
    // else let the user decide
    else {
      $.each(potents, function() { this.potentialize(); });
    }
    
    // controls
    bds.go.off();
    bds.dice.off();
  };

  var on_stage_complete = function(e) {
    self.rollable = true;
    set_playable(false);
    bds.circles.complete_stage(function() {
      bds.roller.on(); 
    });
  };

  var on_rolling = function() {
    if (! self.rollable ) return;
    bds.dice.roll();
    self.rollable = false
    self.moveable = true;
  };

  var on_rolled = function() {
    self.rollable = false;
    bds.roller.off();
    bds.go.on();
  };

  var on_play = function(e, id, delay) {
    if (! can_play() ) return;

    if ( id ) {
      if (! bds.circles.is_current(id) )  
        return;
    }

    var delay = delay || 0;
    setTimeout(function() {
      bds.circles.current.play();
    }, delay);
  };

  var on_score_change = function() {
    bds.score.update();      
  };

  var on_show_potentials = function() {
    alert('test');
    var potents = bds.circles.get_potentials(bds.dice.current_face);
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
        $.publish('bds_stage_complete');
      }
    });

    bds.start.off();
  };

  // create ui elements

  bds.controls = bds.make_actions( $(options.content) );
  bds.page = bds.make_page( $(options.content), options.svg_container );
  bds.banner = bds.make_banner( $(options.content) );
  bds.make_board(svg, json, options);

  // wire events

  $.subscribe('bds_start', on_start);
  $.subscribe('bds_go', on_go);
  $.subscribe('bds_stage_complete', on_stage_complete);
  $.subscribe('bds_rolled', on_rolled);
  $.subscribe('bds_rolling', on_rolling);
  $.subscribe('bds_play', on_play);
  $.subscribe('bds_score_change', on_score_change);
  $.subscribe('bds_show_potentials', on_show_potentials);

  // clear local storage

  bds.db.wipe()
        .save('completed', []);


  // initialize global game variables

  self.started = false;
  self.moveable = false;
  self.rollable = false;
  
  return self;
};
