
d3.select(window).on('load', init); // Once it loads the whole html, then it starts running this

function init() {
    d3.csv(
        'data.csv',
        function(d) {   // This function is to change or play with values from data.csv file when loading them
            d.frequency *= 100.0;
            return d;
        },
        function(error, data) {
            if (error) throw error;
            // console.log(data);
            d3.select('body')  // Selects the body
                .append('ul')  // Creates an empty unordered list
                .selectAll('li')  // Creates list elements
                .data(data)  // select the data from data.csv
                .enter()  // Load the data
                .append('li')  // Add a list element
                .text(function(d){  //Add a line at a time from the data.csv into the list element
                    return d.letter+':'+
                        d.frequency;
                });
        });
    var scale = d3.scaleLinear()
        .domain([0,10])
        .range([0,100]);

    console.log(scale(5.));

    flip_and_padding(); // Call a function ALWAYS ininside

    bar_plot_example();
}


function flip_and_padding() {

    var mydata = [[100, 237, 4],
        [217, 132, 5],
        [160, 110, 7],
        [106, 123, 8]];

    var svg = d3.select('svg');
    var width = +svg.node().getBoundingClientRect().width;
    var height = +svg.node().getBoundingClientRect().height;
    var padding = 20; // definife padding
    var xScale = d3.scaleLinear()
        .domain([0,
            d3.max(mydata,
                function(d){
                    return d[0];
                })])
        .range([padding,width-padding]);  // Add padding to the x axis

    var yScale = d3.scaleLinear()
        .domain(d3.extent(mydata,
            function(d){
                return d[1];
            }))
        .range([height-padding, padding]); // .range([height, 0]); to flip it upside down

    var xAxis = d3.axisBottom(xScale);  // Constructed using a scale

    d3.select("#plotarea")
        .append('g')
        .attr('transform', 'translate(0,' + (height - padding) + ')')  // move axis to the right place
        .attr('class', 'axis x')   // <- Adding primary and secondary class
        .call(d3.axisBottom(xScale));
    d3.select("#plotarea")
        .append('g')
        .attr('transform', 'translate('+padding+', 0)')
        .attr('class', 'axis y')   // <- Adding primary and secondary class
        .call(d3.axisRight(yScale));

    d3.select("#plotarea")
        .selectAll("circle")
        .data(mydata)
        .enter()
        .append("circle")
        .attr("r", "10px")
        .attr("cx", function(d){
            return ""+xScale(d[0])+"px";
        })
        .attr("cy", function(d){
            return ""+yScale(d[1])+"px";
        })


}


function bar_plot_example() {

    var svg = d3.select('svg');
    var margin = {top: 100, right: 100, bottom: 100, left: 100};
    var width = +svg.node().getBoundingClientRect().width - margin.left - margin.right;
    var height = +svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var data = [['A', .08167],
        ['B', .01492],
        ['C', .02782]];

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