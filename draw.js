////////////////////////////////////
// Web app design 
// File Name: draw.js 
// Created Date: 10-Oct-2016
// Author: Niharika Karia
////////////////////////////////////


var h=480;
var w=480;
var speed=200;
var padding=20;
var dataset=[0,1,2,3,4,5,6,7,9];
var pie_labels=["aaaa","aaab","aaac","aad","aaaaae","aaaf","aag","aaah","aai","aaj"];
var pie_values=[20,4,6,8,10,12,12,8,4,2];

var color=d3.scale.category20();
var svg2 = d3.select("#pieChart")
    .append("svg")
    .append("g");
svg2.append("g").attr("class", "slices");
svg2.append("g").attr("class", "labels");
svg2.append("g").attr("class", "lines");
var radius=(w-50)/2;
var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

svg2.attr("transform", "translate(" + w/2 + "," + h/2 + ")");



var svg=d3.select("#barChart")
	.append("svg")
	.attr({ height: h,
		width: w
		});
draw_pie();draw_bar();
d3.select("button").on("click",function(){draw_pie();draw_bar();});

function update_pie()
{	pie_values=[];
	for(i=0;i<10;i++)
	{
	pie_values.push(Math.random());
	}
	
	//pie_labels.shift();
	
//fetch data from api and reconstruct the pie_lables and pie_values
	data=pie_labels.map(function(da,i)
		{return{label: da, value: pie_values[i]} 
		});
	return data;
}
function update_bar()
{
//fetch data from api and reconstruct the dataset
	dataset=[];
	for(i=0;i<10;i++)
        {
        dataset.push(Math.random());
        }

//	dataset.shift(); 
	return dataset;
}


function draw_bar()
{
dataset=update_bar();
var xScale = d3.scale.linear()
		.domain([0, d3.max(dataset,function(d){return(d);})])
		.range([padding, w-padding]);
var xWidthScale = d3.scale.linear()
		.domain([0, d3.max(dataset,function(d){return(d);})])
		.range([0, w-padding-padding]);

var xAxis = d3.svg.axis().scale(xScale)
		.orient("bottom").ticks(5);
var yScale = d3.scale.ordinal()
	.domain(d3.range(dataset.length))
	.rangeRoundBands([ h-padding,padding], 0.1);
var yAxis = d3.svg.axis().scale(yScale)
		.orient("left")
//		.tickFormat(function(d){return(d);})
		;

svg.append("g").attr("class","axis").attr("id", "xaxis").attr("transform", "translate(0,"+(h-padding)+")");
svg.append("g").attr("class","axis").attr("id", "yaxis").attr("transform", "translate("+padding+",0)");

var rects=svg.selectAll("rect")
   .data(dataset);
  
  rects.enter()
   .append("rect")
   .attr({
	y:h,
	x: padding+2,
	height: yScale.rangeBand(),
	width: function(d){return xWidthScale(d);}
	})
   .on("mouseover",function(d){
	d3.select(this).attr("fill","orange");
	var xPosition=parseFloat(d3.select(this).attr("width"))/2;
	var yPosition=parseFloat(d3.select(this).attr("y"))+yScale.rangeBand()/2;
	console.log(dataset[5]);	
	//construct tool tip
	d3.select("#tooltip")
	  .style("left", xPosition +"px")
	  .style("top", yPosition +"px")
	  .select("#value")
	  .text("The Min Value is : "+dataset[6]+"The current value is : "+d);
	
	//display the tip that is constructed
	d3.select("#tooltip").classed("hidden",false);
	})//end of function on  event mouse over
    .on("mouseout",function(){
	d3.select(this).attr("fill","#3b6caa");
	d3.select("#tooltip").classed("hidden",true);
	})//end of function on event mouse out
    ; // end of rect definition

var rec_attr={	
	y: function(d, i) { return yScale(i);},
	x: padding +2,
	height: yScale.rangeBand(),
	width: function(d) { return xWidthScale(d); },
	fill:"#3b6caa" 
   };

rects.attr(rec_attr);
rects.transition().duration(speed).attr(rec_attr);
rects.exit().transition().duration(speed).attr("y",0).attr("fill","#3b4b54").remove();	

svg.select("#xaxis").transition().duration(speed).call(xAxis);
svg.select("#yaxis").transition().duration(speed).call(yAxis);

} //end of draw_bar()

/* 
	var texts=svg.selectAll("text")
	   .data(dataset)
	   .enter()
	   .append("text")
	   .text(function(d) {return d;});
	var text_attr={	
		x: function(d) { return xScale(d)-20; },
		y: function(d,i) { return yScale(i)+yScale.rangeBand()/2;},
	   	"text-anchor": "middle",
		//width: w / dataset.length - barPadding,
		//height: function(d) { return d * 4; },
		fill: "pink" 
	   };
	texts.attr(text_attr);
*/	


//////////////////////////////////       Part 2       ////////////////////

function draw_pie()
{
data=update_pie();
var slice = svg2.select(".slices")
		.selectAll("path.slice")
		.data(pie(data), data.label);

slice.enter().insert("path")
	.attr("fill", function(d,i) { return color(i); })
	.attr("class", "slice");

slice.transition().duration(speed)
	.attrTween("d", function(d) 
	{
		this._current = this._current || d;
		var interpolate = d3.interpolate(this._current, d);
		this._current = interpolate(0);
		return function(t) 
			{
			return arc(interpolate(t));
			};
	});
slice.exit().remove();

//  Drawing the labeling lines
var polyline = svg2.select(".lines")
		.selectAll("polyline")
		.data(pie(data), data.label);
polyline.enter().append("polyline")
	.style("opacity",".25")
	.style("stroke","white")
	.style("stroke-width","2px")
	.style("fill","none");

polyline.transition().duration(speed)
	.attrTween("points", function(d)
	{
		this._current = this._current || d;
		var interpolate = d3.interpolate(this._current, d);
		this._current = interpolate(0);
		return function(t) 
		{
			var d2 = interpolate(t);
			var pos = outerArc.centroid(d2);
			pos[0] = radius * 0.90 * (midAngle(d2) < Math.PI ? 0.9 : -0.9);
			return [arc.centroid(d2), outerArc.centroid(d2), pos];
		};			
	});

polyline.exit().remove();


// Adding text labels
var text = svg2.select(".labels")
		.selectAll("text")
		.data(pie(data), data.label);

text.enter().append("text").text(function(d){return d.data.label;}).attr("fill","white");

//determining position for text
function midAngle(d)
{
	return d.startAngle + (d.endAngle - d.startAngle)/2;
}

text.transition().duration(speed)
	.attrTween("transform", function(d) 
		{
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) 
				{
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = (radius-10) * (midAngle(d2) < Math.PI ? 0.9 : -0.9);
	
				return "translate("+ pos +")";
				};
		})
		.styleTween("text-anchor", function(d)
		{
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) 
			{
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});
	
text.exit().remove();


} // end of function draw_pie()




/////////////////////////      Update data      /////////////////////
	d3.select("#sel3").on("change",function() { 
		var newdata=[];
		var anum=parseInt(document.getElementById("sel3").value);
		
		for (var i=0;i<anum;i++){
			v=new_data[i];
			newdata.push(v);
			}
		var bars = svg.selectAll("rect").data(newdata);

	}); // end of on change function

