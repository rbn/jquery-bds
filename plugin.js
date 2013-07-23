// TODO: fix this so that most of the logic is in bds ... for now working here
(function($){
  $.fn.bds = function(options) {
    
    options = $.extend({}, $.fn.bds.defaultOptions, options);

    this.each(function() {
      var $content = $(this),
          $left = $('<div id="left"></div>'),
          $svgContent = $('<div id="svgContainer"></div>');


      $content.append($left);
      $content.append($svgContent);

      var svg =  d3.select(  '#' + $svgContent.attr('id') )
                      .append('svg')
                      .attr('width', 900)
                      .attr('height', 900);

          d3.json(bds.dataUrl, function(error, root) {

            if (typeof(Storage) === 'undefined')
              alert('This application requires HTML5 support. Please use a different browser.');

            bds.app = bds.makeApp(svg, root, { 
                        content: '#' + $content.attr('id'),
                        svgContainer: '#' + $svgContent.attr('id')
                      });

            $left.load(bds.leftUrl);

          });

      });


      return this;
  };

  $.fn.bds.defaultOptions = {
    a: '1',
    b: '2'
  };
  
})(jQuery);
