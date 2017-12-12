// Set up on-load initialization
d3.select(window).on('load', init);

// Initialiation function. Called after body has loaded
function init() {

    var svg = d3.select('svg');
    var margin = {top: 100, right: 100, bottom: 100, left: 100};
    var width = +svg.node().getBoundingClientRect().width - margin.left - margin.right;
    var height = +svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var data = [['A', .08167],
        ['B', .01492],
        ['C', .02782]];
    // var data = d3.csv('temperaturesKobenhavn.csv');


    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1)
        .domain(data.map(function(d) { return d[0]; }));

    var y = d3.scaleLinear().rangeRound([height, 0])
        .domain([0, d3.max(data, function(d) { return d[1]; })]);

    g.append("g")
        .attr("class", "axis x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis y")
        .call(d3.axisLeft(y).ticks(10, "%"));

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar") // Atribute of type class and named bar.
        .attr("x", function(d) { return x(d[0]); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d[1]); });
}