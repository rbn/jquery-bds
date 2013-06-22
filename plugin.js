// TODO: fix this so that most of the logic is in bds ... for now working here
(function($){
  $.fn.bds = function(options) {
    
    options = $.extend({}, $.fn.bds.defaultOptions, options);

    this.each(function() {
      var $content = $(this),
          $left = $('<div id="left"></div>'),
          $svg_content = $('<div id="svg_container"></div>');


      $content.append($left);
      $content.append($svg_content);

      var svg =  d3.select(  '#' + $svg_content.attr('id') )
                      .append('svg')
                      .attr('width', 900)
                      .attr('height', 900);

          d3.json(bds.data_url, function(error, root) {

            if (typeof(Storage) === 'undefined')
              alert('This application requires HTML5 support. Please use a different browser.');

            bds.make_app(svg, root, { 
                  content: '#' + $content.attr('id'),
                  svg_container: '#' + $svg_content.attr('id')
                });

            $left.load(bds.left_url);

          });

      });


      return this;
  };

  $.fn.bds.defaultOptions = {
    a: '1',
    b: '2'
  };
  
})(jQuery);
