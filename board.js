bds.makeBoard = function(svg, json, options) {
  var circleClass = 'bdsCircle',
      labelClass = 'bdsLabel';

  var drawCircles = function () {

    var defs = svg.append('svg:defs');
    var pattern = defs.selectAll('pattern')
                      .data([0])
                      .enter()
                      .append('pattern')
                      .attr('id', 'img-bkg')
                      .attr('x', 0)
                      .attr('y', 0)
                      .attr('patternUnits', 'userSpaceOnUse')
                      .attr('height', 1)
                      .attr('width', 1);

    var elem = svg.selectAll('g bds')
                        .data(json);

    var elemEnter = elem.enter()
                        .append('g');
                    
    var circle =  elemEnter.append('circle')
                            .attr('cx', function (d) { return d.x; })
                            .attr('cy', function (d) { return d.y; })
                            .attr('r', function(d) { return d.r; })
                            .attr('class', circleClass)
                            .attr('id', function(d) { return d.id; })
                            .attr('data-name', function(d) { return d.internal_name; })
                            .attr('data-next', function(d) { return JSON.stringify(d.nexts); })
                            .attr('data-start', function(d) { return d.start; })
                            .style('fill', function(d) { return d.color; })
                            .style('stroke', 'black')
                            .style('stroke-width', '5')
                            ;

    elemEnter.append('text')
      .attr('dx', function(d){return d.x - 80; })
      .attr('dy', function(d){return d.y; }) 
      .attr('fill', 'none')
      .attr('class', labelClass)
      .text(function(d){ return d.label; });
      

  };

  // ------
  // note - expects json to contain info about only one line
  //
  //  var lineData = [ { "x": 30,   "y": 30},  { "x": 70,  "y": 70},
  //                   { "x": 70,  "y": 70}, { "x": 110,  "y": 110}];
  var drawPath = function () {

    // TODO: clean this up - fake memo - puts all circle data in 
    // an object referencable by id - as of now has to be done
    // prior to creating bds.circles
    var memo = (function() {
      var obj = {};
      $.each(json, function() {
        obj[this.internal_name] = this;
      });
      return obj;
    })();

    var lineFunction = d3.svg.line()
                              .x(function(d) { return d.x; })
                              .y(function(d) { return d.y; })
                              .interpolate('linear');  

    // from/to => { x:x, y:y}
    var getPathArray = function(from, to) {
      return [ from, to ];
    };

    // for each "circle" object, draw all of its connections
    $.each(json, function() {
      var from = { 'x' : this.x, 'y': this.y };
      $.each(this.nexts, function() {
        var next = memo[this];
        if (! next ) return; 
        var to = { 'x' : next.x, 'y': next.y };
        var lineGraph = svg.append('path')
                           .attr('d', lineFunction(getPathArray(from, to)))
                           .attr('stroke', bds.pathColor)
                           .attr('stroke-width', bds.pathWidth)
                           .attr('stroke-dasharray', bds.dashArray)
                           .attr('stroke-linecap', 'round')
                           .style('fill', 'red')
                           ;
      });
     });

    return;
    
    var lineGraph = svg.append('path')
                       .attr('d', lineFunction(transformCirclesToPath(json)))
                       .attr('stroke', bds.pathColor)
                       .attr('stroke-width', bds.pathWidth)
                       .style('fill', 'none');


    // var pi = Math.PI;
    // var arc = d3.svg.arc()
    //             .innerRadius(20)
    //             .outerRadius(70)
    //             .startAngle(0)
    //             .endAngle(100);

    // var arcGraph = svg.append('path')
    //                   .attr('d', arc(transformCirclesToPath(json)))
    //                   .attr('transform', 'translate(130,60)'); 
  };

  // initialization
  drawPath();
  drawCircles();

  $('.' + circleClass).each(function() {
     var label;
     $(this).closest('g').find('.' + labelClass).each(function() {
      label = this;
     });
     bds.makeCircle(this, label);  
  });

};
