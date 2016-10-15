// Your beautiful D3 code will go here
var h=250;
var w=400;
var barPadding =1;
var padding=8;
var dataset = [ 11,2,9,5, 10, 15, 20,9,22, 25 ];
var xScale = d3.scale.linear()
		.domain([0, d3.max(dataset,function(d){return(d);})])
		.range([padding, w-padding]);
var yScale = d3.scale.ordinal()
	.domain(d3.range(dataset.length))
	.rangeRoundBands([0, h], 0.2);

var svg=d3.select("body")
	.append("svg")
	.attr({ height: h,
		width: w
		});

var rects=svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect");

var rec_attr={	
	y: function(d, i) { return yScale(i);},
	//x: function(d) { return h - (d * 4); },
	height: yScale.rangeBand(),
	width: function(d) { return xScale(d); },
	fill: "blue"
   };

rects.attr(rec_attr);

d3.select("button").on("click",function() 
	{ 
	var anum=Math.random();
	console.log(anum);
		//	alert("Hello "+anum);
			dataset=[1*anum,2*anum,5*anum,anum,2*anum,1*anum,2*anum,anum,3*anum,anum]; //update
			svg.selectAll("rect").data(dataset) //rebind	
			.attr("width",function(d){return xScale(d);});  //re-draw 
	});

