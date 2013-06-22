// //////////////////
// control container
bds.make_actions = function( $content ) {
  var self = {},
      $actions = $('<div id="actions">'),
      $table = $('<table><tbody></tbody></table>'),
      $tr = $('<tr>');

  $table.find('tbody').append($tr);
  $actions.append($table);
  
  $.each(['start', 'roller', 'dice', 'go', 
            'score', 'start_over'], function() {

    var $td = $('<td>'),
        $div = $('<div id=' + this + '>');
    
    // create the control and expose it in bds namespace
    bds[this] = bds['make_' + this]($div);

    $td.append($div);
    $tr.append($td);
  });

  $actions.prependTo($content);
  return self;
};

// /////////////////////
//  page
//
bds.make_page = function( $content, svg_container_id ) {
  var self = {},
      $board = $content.find(svg_container_id),
      $stage = $('<div id="stage">');

  $stage.hide();
  
  self.$board = $board;
  self.$stage = $stage;

  $content.append($stage);

  return self;
};

// //////////////////
// dice constructor
//
bds.make_dice = function($container) {
  var self = {},
      $die = $('<a href="#"></a>')
      ;

  var roll = function() {
    self.current_face =  Math.floor((Math.random()*3) + 1);
    on();
    $.publish('bds_rolled');
  };

  var on = function() {
    var img = '<img src="/assets/dice/Blue_';
    img += self.current_face;
    img += '.png" />';
    $die.html('').append(img);
  };

  var off = function() {
    var img = '<img src="/assets/dice/Blue_';
    img += self.current_face;
    img += '_frozen';
    img += '.png" />';
    $die.html('').append(img);
  };

  // API
  self.roll = roll;
  self.on = on;
  self.off = off;

  $container.html($die);
  return self;
}

///////////////////////////
// roller button ctr
//
// TODO: can these control elems user a factory?
bds.make_roller = function($container) {
  var self = {},
      $roller = $('<a href="#"></a>'),
      $div = $('<div>'), 
      $div_gray = $('<div>') 
      ;

  // set w/h same as background image
  $div.css('width', '75px').css('height', '75px')
      .css('background-image', 'url("/assets/controls/roller1.jpg")')
      .css('background-repeat', 'no-repeat')
      .css('display', 'none');

  $div_gray.css('width', '75px').css('height', '75px')
      .css('background-image', 'url("/assets/controls/roller1_gray.jpg")')
      .css('background-repeat', 'no-repeat');

  // stack divs on top of each other
  $div_gray.append($div);
  $roller.append($div_gray);

  // wire events

  $roller.on('click', function() {
    $.publish('bds_rolling'); 
  });
  
  var on = function() {
    $div.fadeIn('slow');
  };

  var off = function() {
    $div.fadeOut('slow');
  };

  // API
  self.on = on;
  self.off = off;

  // init
  off();
  $container.html($roller);

  return self;
};

///////////////////////////
// start button constructor
// 
bds.make_start = function($container) {
  var self = {},
      $start = $('<a href="#"></a>')
      ;

  var on = function() {
    $start.html('').append('<img src="/assets/controls/start.jpg" />');
  };

  var off = function() {
    $start.html('').append('<img src="/assets/controls/start_gray.jpg" />');
  };

  // wire events
  $start.on('click',function() {
    $.publish('bds_start');
  });

  // API
  self.on = on;
  self.off = off;

  // init
  on();
  $container.html($start);
  return self;
};

// ///////////////////
// go button ctr
// 
bds.make_go = function($container) {
  var self = {},
      $go = $('<a href="#"></a>');

  var go = function() {
    $.publish('bds_go'); 
  };

  var on = function() {
    $go.html('<img src="/assets/controls/go.png" />');
  };

  var off = function() {
    $go.html('<img src="/assets/controls/go_gray.png" />');
  };

  // wire events
  $go.on('click', go);

  // API
  self.on = on;
  self.off = off;

  // init
  off();
  $container.html($go);

  return self;
};

//////////////////////////
// score ctr
//
bds.make_score = function($container) {
  var self = {},
      $div = $('<div>'),
      $label = $('<div>Score</div>'),
      $value = $('<div>');

  var on = function() {
    var current_score = bds.db.get('score') || 0;
    $value.text( current_score );
  };

  var update = function() {
      on();
  };

  // API
  self.on = on;
  self.update = update;

  // init
  on();
  $div.append($label).append('<br />').append($value);
  $div.css('height', '100%');
  $label.css('font-size', '14px').css('padding', '4px');
  $value.css('font-size', '36px')
        .css('margin', 'auto')
        .css('text-align', 'center');
  $container.html($div);

  return self;
};


//////////////////////////////
//  start over
//
bds.make_start_over = function($container) {
  var self = {},
      $start_over = $('<div>');

  var on = function() {
    $start_over.html('<img src="/assets/controls/start-over.jpg" />');
  };

  var off = function() {
  };

  // wire events
  $start_over.on('click', function() {
    alert('not working yet');
  });
 
  // init
  on();
  $container.html($start_over);

  self.on = on;
  self.off = off;

  return self;
};

////////////////////////////////
// banner
//
bds.make_banner = function($container) {
  var self = {},
      $top_banner = $('<div id="top_banner">'),
      $info = $('<div>'),
      $dashboard = $('<div>');

  //$.each(['info', 'how to play', 'dashboard'], function() {
  for(link in bds.info_bar) {
    var $a = $('<a href="' + bds.info_bar[link].link + '"></a>');
    $a.text(bds.info_bar[link].text);
    $info.append( $a );
    $info.append( ' | ' );
  }

  // TODO: a lot of things in the app are based on the banner being a height of 50px
  // try to make that figure a variable component

  $dashboard.css('width', '600px')
            .css('position', 'absolute')
            .css('left', '50%')
            .css('margin-left', '-300px')
            .css('margin-top', '50px')
            .css('padding', '12px')
            .css('height', '300px')
            .css('color', 'white')
            .css('background-color', 'rgba(20,10,75,0.9)')
            .css('border-left', '2px dotted white')
            .css('border-right', '2px dotted white')
            .css('border-bottom', '2px dotted white')
            .css('display', 'none');

  $dashboard.append('<h1>Dashboard</h1>');
  $dashboard.append('<p>get from server? ... </p>');
  $info.css('padding', '6px').css('float', 'right');

  $top_banner.append($info);
  $dashboard.prependTo($container);
  $top_banner.prependTo($container);

  // wire events

  $info.on('click', function() {
    $dashboard.fadeIn('slow');
  });
  
  $dashboard.on('click', function() {
    $(this).fadeOut();
    return false;
  });

  return self;
}
