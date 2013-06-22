bds.db = (function() {
  var self = {},
      ls = localStorage;
    
  var save = function(key, value) {
    ls[key] = JSON.stringify( value );
  };
   
  var get = function(key) {
    if ( ls[key] === undefined ) return;
    return JSON.parse( ls[key] );
  };

  var wipe = function() {
    ls.clear();
    return self;
  };
  
  // API
  self.save = save;
  self.get = get;
  self.wipe = wipe;

  return self;

})();
