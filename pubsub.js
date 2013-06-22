
// simple jquery pubsub - credit to Ben Alman
//
// usage:
// 
//  function handle1(e, a, b) {
//    alert('event raised?!? ' + a);
//  }
//  
//  function handle2(e, a, b) {
//    alert('i heard it too! ' + b);
//  }
//  
//  $.subscribe('anEvent', handle1);
//  $.subscribe('anEvent', handle2);
//  
//  $.publish('anEvent', ['hi', 'hello there']);

(function(S) {

  var o = $({});

  $.subscribe = function() {
    o.on.apply(o, arguments);
  };

  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };

  $.publish = function() {
    o.trigger.apply(o, arguments);
  };
  
}(jQuery));

