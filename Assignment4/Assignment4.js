var margin = {top:20 , right: 1, bottom: 30, left:40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#hand").append("svg")
    .attr("width", width - 300)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("+ margin.left + "," + margin.top + ")");





var width2 = width - 120;
var svg2 = d3.select("#pca").append("svg")
    .attr("width", width2)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("+ margin.left + "," + margin.top + ")");


d3.text("hands.csv", function(text) {
  var hand_data = d3.csv.parseRows(text).map(function(row) {
    return row.map(function(value) {
      return +value;

    });
  });
d3.text("hands_pca.csv", function(text) {
  var hand_pca_data = d3.csv.parseRows(text).map(function(col, i) {
    return d3.csv.parseRows(text).map(function(row) {
      return +row[i]
    })
  });


var hands=[];

for (var i in hand_data) {

  var shape = hand_data[i];
  hands[i] = d3.zip(shape.slice(0, 56),shape.slice(56, 113));

}


var pc = [1,2];

var pca_hands = d3.zip(hand_pca_data[pc[0]-1],hand_pca_data[pc[1]-1]);

var pos = {x: 250, y: 230, xh: 60, yh: 85};
var circ_r = 200;
var scale_h = width/3;

  // Scale the range of the data

  var xValue = function(d) { return d;}, // data -> value
    xScale = d3.scale.linear()
        .domain([d3.min(pca_hands, function(d) { return d[0]; })/0.8,d3.max(pca_hands, function(d) { return d[0]; })*1.2])
        .range([0, width2]), // value -> display
    xMap = function(d) { return xScale(xValue(d[0]));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");
// setup y
var yValue = function(d) { return d;}, // data -> value
    yScale = d3.scale.linear()
        .domain([d3.min(pca_hands, function(d) { return d[1]; })/0.8, d3.max(pca_hands, function(d) { return d[1]; })*1.2])
        .range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d[1]));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

  // Add the X Axis
svg2.append("g")
    .attr("class", "x_axis")
    .attr("transform", 'translate(0, '+ height +')')
    .call(xAxis);
    svg2.append("text")
    .attr("class", "xlabel")
    .attr("x", width2 - 40)
    .attr("y", height - 6)
    .style("text-anchor", "end")
    .text("PC"+pc[0]);

  // Add the Y Axis
svg2.append("g")
    .attr("class", "y_axis")
    .call(yAxis);
  svg2.append("text")
    .attr("class", "ylabel")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("PC"+pc[1]);

var tooltip = d3.select("#pca")
  .append("div")
  .style("background-color", "orange")       // Purple
  .style("font-Family", "")
  .style("background-opacity", "0.15")
  .style("position", "absolute")
  .style("visibility", "hidden");

  var lineFn = d3.svg.line()
      .x(function(d) { return d[0]*scale_h; })
      .y(function(d) { return d[1]*scale_h; })
      .interpolate("basis");

svg.append('circle')
    .attr("r", width/4)
    .attr("stroke", "black")
    .attr("fill", "white")  // Exterior of the hand circle
    .attr('transform', 'translate('+pos.x+','+(pos.y+20)+')')
    .on("mouseover", function(){ // when I use .style("fill", "red") here, it works
        d3.select(this)
            .style("fill", "transparent");
    })
    .on("mouseout", function(){
        d3.select(this)
            .style("fill", "white");
    });



var handy = svg.append("g")
    .append("path")
      .attr("d", lineFn(hands[0]))
      .attr("stroke", "black")
      .attr("stroke-width", 5)  // width of the ouline of the hand
      .attr("opacity", "1")  // Ouline of the hand is completely opaque
      //.attr("fill", "rgba(255, 230, 225, 0.6)")  // Fill the hand
    .attr("fill", "rgba(255, 250, 200, 0.6)")  // Fill the hand
      .attr('transform', 'translate('+(pos.x/4-15)+','+(pos.y/4+20)+')');  // Place the hand in the middle of the circle


var points = svg2.selectAll('circle')
  .data(pca_hands)
  .enter()
  .append('circle')
  .attr("cx", xMap)
  .attr("cy", yMap)
  .attr('r', 4)
  .on('click', function(d, i) {
  handy
    .transition()
    .duration(1500)
      .attr("d", lineFn(hands[i]));})
  .on("mouseover", function(d, i){return tooltip.style("visibility", "visible").text("Hand number: " + i), ind = i,
      svg2.selectAll('circle')
          .attr("r", function(d,i){
              if(ind===i) return 8;
              else return 4;
          })
          .style('fill',function(d,i){
                  if(ind===i) return 'orange';
                  else return 'white';
              }),
      svg2.style("cursor", "pointer");})
  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  .on("mouseout", function(d, i){return tooltip.style("visibility", "hidden"), ind = i,
      svg2.selectAll('circle')
      .attr("r", function(d,i){
          if(ind===i) return 4;
          else return 4;
      })
          .style('fill',function(d,i){
              if(ind===i) return 'white';
          });});




});


    d3.select("#outlier39")
        .on("mouseover",   function(){

            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(39===i) return 10;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(39===i) return 'green';
                    else return 'white';
                });
        })
        .on("mouseout",  function () {
            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(39===i) return 4;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(39===i) return 'white';
                });
        });


    d3.select("#outlier37")
        .on("mouseover",   function(){

            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(37===i) return 10;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(37===i) return 'red';
                    else return 'white';
                });
        })
        .on("mouseout",  function () {
            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(37===i) return 4;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(37===i) return 'white';
                });
        });

    d3.select("#outlier35")
        .on("mouseover",   function(){

            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(35===i) return 10;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(35===i) return 'blue';
                    else return 'white';
                });
        })
        .on("mouseout",  function () {
            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(35===i) return 4;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(35===i) return 'white';
                });
        });

    d3.select("#outlier30")
        .on("mouseover",   function(){

            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(30===i) return 10;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(30===i) return 'yellow';
                    else return 'white';
                });
        })
        .on("mouseout",  function () {
            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(30===i) return 4;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(30===i) return 'white';
                });
        });


});



