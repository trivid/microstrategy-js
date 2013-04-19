/*
* MSTR In grid bar graph custom visualization
*
* Depends:
* jquery.js
* jquery.livequery.js
* monitor.jquery.js
*/
var inGridGraph = (function(){
	var animationDuration = 2000;
	var heightRatio = 0.8;
	
	function findMax(a){
		var c = a.slice(0);
		return c.sort(function(a,b){
			return (a-b);
		}).reverse()[0];
	}
	function drawGraph(gridID, dataCellMIndex, targetSpaceMIndex){
		var targetSpace = $("#"+gridID+" td[i='0A"+targetSpaceMIndex+"']");
		var dataCell = $("#"+gridID+" td[i='0A"+dataCellMIndex+"']");
		var data = [];
		dataCell.each(function(i,c){
			var n = c.innerHTML.replace(/,/g,"");
			data.push(parseInt(n));
		})

		var max = findMax(data);
		
		// Bar color is determined by the text color of the data cell
		var barColor = dataCell.css("color");
		targetSpace.html("");
		targetSpace.removeClass("emptyCell");
		var style = {
			"vertical-align":"middle",
			"background":barColor,
			"float":"left"
		};
		var bar = $("<div></div>");
		bar.css(style);
		
		style = {
			"text-align":"left",
			"float":"left",
			"padding-left":"2px",
			"num":"0"
		}
		var label = $("<span></span>");
		label.css(style);

		// Calculate text reserve using a ruler
		var ruler = $("<span></span>").css("visibility","hidden").css("white-space","nowrap");
		$("body").append(ruler.css("font-size",targetSpace.css("font-size")));
		var textWidthReserver = ruler.html(max).width()+1;
		ruler.remove();

		targetSpace.each(function(i,td){
			var ratio = data[i] / max;
			var targetWidth = ($(td).width()- textWidthReserver)*ratio;
			bar.css("height", $(td).height()*heightRatio);
			$(td).append($(bar).clone().animate({width:"+="+targetWidth},animationDuration));
			$(td).append($(label).clone().animate({num:data[i]},
				{duration:animationDuration, 
					 step:function(now, fx){
						fx.elem.innerHTML=Math.round(now)}}));
			});
	}
	
	var inGridGraph = {
		setAnimationDuration: function(n){
			animationDuration = n;
		},
		
		setHeightRatio: function(n){
			heightRatio = n;
		},
		
		setup: function(gridID, dataCellMIndex, targetSpaceMIndex){
			$("#"+gridID).livequery(function(){
				drawGraph(gridID, dataCellMIndex, targetSpaceMIndex);
			});
			$("#"+gridID).monitor();
		}
	};
	
	return inGridGraph;
}());

