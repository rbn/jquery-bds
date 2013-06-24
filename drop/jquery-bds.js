var bds={};bds.dataUrl="/stageData";bds.leftUrl="left";bds.pathWidth=15;bds.pathColor="blue";bds.dashArray="1, 30";bds.infoBar={info:{text:"info",link:"#"},howToPlay:{text:"how to play",link:"#"},dashboard:{text:"dashboard",link:"#"},save:{text:"save",link:"#"},startOver:{text:"start over",link:"#"},admin:{text:"admin",link:"/admin"}};bds.db=function(){var b={},c=localStorage;b.save=function(a,d){c[a]=JSON.stringify(d)};b.get=function(a){if(void 0!==c[a])return JSON.parse(c[a])};b.wipe=function(){c.clear();return b};return b}();bds.noop=function(){};(function(){var b=$({});$.subscribe=function(){b.on.apply(b,arguments)};$.unsubscribe=function(){b.off.apply(b,arguments)};$.publish=function(){b.trigger.apply(b,arguments)}})(jQuery);bds.circles=function(){var b={},c=function(a){if(a){for(i=0;i<a;i++){var c=i==a-1,f=b.current.next()[0];b.current=b[f];c||setTimeout(b.current.hop,250*i)}setTimeout(b.current.pop,250*a)}else b.start.pop()},a=function(d,c,f){if(void 0===d)return[];c=c||b.current;f=f||[];if(!d)return f.push(c),!1;c=c.next();$.each(c,function(){a(d-1,b[this],f)});return f};b.add=function(a,c){b[a]=c;c.isStart()&&(b.start=c,b.current=b.start)};b.get=function(a){return b[a]};b.first=function(){c()};b.isCurrent=function(a){return b.current.id==
a};b.leaveAndLand=function(a){b.current.drop();c(a)};b.completeStage=function(a){b.current.complete(a);bds.keeper.add(10);a=b.current.id;var c=bds.db.get("completed"),f=bds.db.get(a);-1<$.inArray(f,c)||c.push(a);bds.db.save("completed",c)};b.getPotentials=a;return b}();
bds.makeCircle=function(b,c){var a={},d=$(b),e=d3.select(b),f=e.attr("r");c=d3.select(c);var h=function(b,d){b=b||bds.noop;e.transition().duration(1E3).attr("r",4*f).each("end",function(){b();d||c.attr("font-size",20).style("fill","black")});return a},g=function(){e.transition().duration(500).attr("r",f);c.transition().attr("font-size",10).attr("dx",function(a){return a.x-10}).attr("dy",function(a){return a.y+5}).text("MC");return a};a.name=name;a.pop=h;a.drop=g;a.hop=function(){h(g,!0)};a.sticky=
!1;a.isStart=function(){return d.data("start")};a.next=function(){return d.data("next")};a.play=function(){bds.page.$board.fadeOut(1200,function(){bds.page.$stage.load("/stages/"+a.id,function(){$(this).fadeIn(1200)})})};a.potentialize=function(){h();d.on("click",function(){$.publish("bdsDepotentialize",[a.id]);bds.circles.current=a;$.publish("bdsPlay",[null,3E3])})};a.complete=function(a,b){a=a||bds.noop;e.transition().duration(2500).style("fill","silver").style("stroke","black").each("end",function(){a();
c.style("fill","black");b?c.text("MC").attr("dx",function(a){return a.x-10}).attr("dy",function(a){return a.y+5}):c.text("Marketing Call")})};a.id=d.attr("id");$.subscribe("bdsDepotentialize",function(b,c){a.id!=c&&(g(),d.off())});bds.circles.add(a.id,a);return a};bds.makeActions=function(b){var c=$('<div id="actions">'),a=$("<table><tbody></tbody></table>"),d=$("<tr>");a.find("tbody").append(d);c.append(a);$.each("start roller dice go score startOver".split(" "),function(){var a=$("<td>"),b=$("<div id="+this+">");bds[this]=bds["make_"+this](b);a.append(b);d.append(a)});c.prependTo(b);return{}};bds.makePage=function(b,c){var a={},d=b.find(c),e=$('<div id="stage">');e.hide();a.$board=d;a.$stage=e;b.append(e);return a};
bds.makeDice=function(b){var c={},a=$('<a href="#"></a>'),d=function(){var b;b='<img src="/assets/dice/Blue_'+c.currentFace;a.html("").append(b+'.png" />')};c.roll=function(){c.currentFace=Math.floor(3*Math.random()+1);d();$.publish("bdsRolled")};c.on=d;c.off=function(){var b;b='<img src="/assets/dice/Blue_'+c.currentFace;b+='Frozen.png" />';a.html("").append(b)};b.html(a);return c};
bds.makeRoller=function(b){var c={},a=$('<a href="#"></a>'),d=$("<div>"),e=$("<div>");d.css("width","75px").css("height","75px").css("background-image",'url("/assets/controls/roller1.jpg")').css("background-repeat","no-repeat").css("display","none");e.css("width","75px").css("height","75px").css("background-image",'url("/assets/controls/roller1Gray.jpg")').css("background-repeat","no-repeat");e.append(d);a.append(e);a.on("click",function(){$.publish("bdsRolling")});e=function(){d.fadeOut("slow")};
c.on=function(){d.fadeIn("slow")};c.off=e;e();b.html(a);return c};bds.makeStart=function(b){var c={},a=$('<a href="#"></a>'),d=function(){a.html("").append('<img src="/assets/controls/start.jpg" />')};a.on("click",function(){$.publish("bdsStart")});c.on=d;c.off=function(){a.html("").append('<img src="/assets/controls/startGray.jpg" />')};d();b.html(a);return c};
bds.makeGo=function(b){var c={},a=$('<a href="#"></a>'),d=function(){a.html('<img src="/assets/controls/goGray.png" />')};a.on("click",function(){$.publish("bdsGo")});c.on=function(){a.html('<img src="/assets/controls/go.png" />')};c.off=d;d();b.html(a);return c};
bds.makeScore=function(b){var c={},a=$("<div>"),d=$("<div>Score</div>"),e=$("<div>"),f=function(){var a=bds.db.get("score")||0;e.text(a)};c.on=f;c.update=function(){f()};f();a.append(d).append("<br />").append(e);a.css("height","100%");d.css("font-size","14px").css("padding","4px");e.css("font-size","36px").css("margin","auto").css("text-align","center");b.html(a);return c};
bds.makeStartOver=function(b){var c={},a=$("<div>"),d=function(){a.html('<img src="/assets/controls/start-over.jpg" />')};a.on("click",function(){alert("not working yet")});d();b.html(a);c.on=d;c.off=function(){};return c};
bds.makeBanner=function(b){var c=$('<div id="topBanner">'),a=$("<div>"),d=$("<div>");for(link in bds.infoBar){var e=$('<a href="'+bds.infoBar[link].link+'"></a>');e.text(bds.infoBar[link].text);a.append(e);a.append(" | ")}d.css("width","600px").css("position","absolute").css("left","50%").css("margin-left","-300px").css("margin-top","50px").css("padding","12px").css("height","300px").css("color","white").css("background-color","rgba(20,10,75,0.9)").css("border-left","2px dotted white").css("border-right",
"2px dotted white").css("border-bottom","2px dotted white").css("display","none");d.append("<h1>Dashboard</h1>");d.append("<p>get from server? ... </p>");a.css("padding","6px").css("float","right");c.append(a);d.prependTo(b);c.prependTo(b);a.on("click",function(){d.fadeIn("slow")});d.on("click",function(){$(this).fadeOut();return!1});return{}};bds.makeBoard=function(b,c){var a={};$.each(c,function(){a[this.id]=this});var d=d3.svg.line().x(function(a){return a.x}).y(function(a){return a.y}).interpolate("linear");$.each(c,function(){var c={x:this.x,y:this.y};$.each(this.nexts,function(){var e=a[this];e&&(e={x:e.x,y:e.y},b.append("path").attr("d",d([c,e])).attr("stroke",bds.pathColor).attr("stroke-width",bds.pathWidth).attr("stroke-dasharray",bds.dashArray).attr("stroke-linecap","round").style("fill","red"))})});b.append("svg:defs").selectAll("pattern").data([0]).enter().append("pattern").attr("id",
"img-bkg").attr("x",0).attr("y",0).attr("patternUnits","userSpaceOnUse").attr("height",1).attr("width",1);var e=b.selectAll("g bds").data(c).enter().append("g");e.append("circle").attr("cx",function(a){return a.x}).attr("cy",function(a){return a.y}).attr("r",function(a){return a.r}).attr("class","bdsCircle").attr("id",function(a){return a.id}).attr("data-next",function(a){return JSON.stringify(a.nexts)}).attr("data-start",function(a){return a.start}).style("fill",function(a){return a.color}).style("stroke",
"black").style("stroke-width","5");e.append("text").attr("dx",function(a){return a.x-80}).attr("dy",function(a){return a.y}).attr("fill","none").attr("class","bdsLabel").text(function(a){return a.label});$(".bdsCircle").each(function(){var a;$(this).closest("g").find(".bdsLabel").each(function(){a=this});bds.makeCircle(this,a)})};bds.keeper=function(){var b={};SCORE="score";b.add=function(b){var a=bds.db.get(SCORE)||0;bds.db.save(SCORE,a+b);$.publish("bdsScoreChange")};return b}();bds.makeApp=function(b,c,a){var d={},e=!1;bds.controls=bds.makeActions($(a.content));bds.page=bds.makePage($(a.content),a.svgContainer);bds.banner=bds.makeBanner($(a.content));bds.makeBoard(b,c,a);$.subscribe("bdsStart",function(){d.started||(e=d.started=!0,bds.circles.first(),bds.start.off(),$.publish("bdsPlay",[null,3E3]))});$.subscribe("bdsGo",function(){if(d.started&&d.moveable){d.moveable=!1;e=!0;var a=bds.circles.getPotentials(bds.dice.currentFace);1===a.length?(bds.circles.leaveAndLand(bds.dice.currentFace),
$.publish("bdsPlay",[null,3E3])):$.each(a,function(){this.potentialize()});bds.go.off();bds.dice.off()}});$.subscribe("bdsStageComplete",function(){d.rollable=!0;e=!1;bds.circles.completeStage(function(){bds.roller.on()})});$.subscribe("bdsRolled",function(){d.rollable=!1;bds.roller.off();bds.go.on()});$.subscribe("bdsRolling",function(){d.rollable&&(bds.dice.roll(),d.rollable=!1,d.moveable=!0)});$.subscribe("bdsPlay",function(a,b,c){if(e&&(!b||bds.circles.isCurrent(b)))setTimeout(function(){bds.circles.current.play()},
c||0)});$.subscribe("bdsScoreChange",function(){bds.score.update()});$.subscribe("bdsShowPotentials",function(){alert("test");var a=bds.circles.getPotentials(bds.dice.currentFace);alert(a.length)});bds.db.wipe().save("completed",[]);d.started=!1;d.moveable=!1;d.rollable=!1;return d};(function(b){b.fn.bds=function(c){c=b.extend({},b.fn.bds.defaultOptions,c);this.each(function(){var a=b(this),c=b('<div id="left"></div>'),e=b('<div id="svgContainer"></div>');a.append(c);a.append(e);var f=d3.select("#"+e.attr("id")).append("svg").attr("width",900).attr("height",900);d3.json(bds.dataUrl,function(b,g){"undefined"===typeof Storage&&alert("This application requires HTML5 support. Please use a different browser.");bds.makeApp(f,g,{content:"#"+a.attr("id"),svgContainer:"#"+e.attr("id")});
c.load(bds.leftUrl)})});return this};b.fn.bds.defaultOptions={a:"1",b:"2"}})(jQuery);