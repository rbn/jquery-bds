bds.noop = function() {};

String.prototype.capitalize = function() {
  return this.replace(/\w\S*/g,
                function(txt){
                  return txt.charAt(0).toUpperCase() + txt.substr(1);
                });
}
